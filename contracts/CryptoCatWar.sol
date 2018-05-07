pragma solidity ^0.4.23;

contract Admin {
    address private adminAddress;

    modifier adminOnly() {
        require(msg.sender == adminAddress);
        _;
    }

    function setAdmin(address addr) internal {
        require(adminAddress == 0); // ensure only one person can be admin
        adminAddress = addr;
    }

    function removeAdmin() public adminOnly {
        adminAddress = 0;
    }
}

contract Abstract is Admin {
    struct Cat {
        uint id;
        address owner;

        bool isMale;
        uint8 levelCap;

        uint8 level;
        uint64 exp;

        bool onAuction;
        uint highestBid;
        address highestBidder;
    }

    struct MaleCat {
        /*
            element:
            - 0: fire
            - 1: water
            - 2: wind
        */
        uint8 element;

        uint16 atkPerLv;
        uint16 defPerLv;
        uint16 hpPerLv;
        uint16 baseAtk;
        uint16 baseDef;
        uint16 baseHp;
    }

    struct FemaleCat {
        uint breedFee;
        uint lastBreed;
    }

    uint expPrice = 1000 wei;

    mapping(uint => MaleCat) public maleCatInfo;
    mapping(uint => FemaleCat) public femaleCatInfo;
    Cat[] public cats;

    mapping(address => uint[]) public ownedCats;

    uint randomSeed;

    function nextSeed() private {
        randomSeed = uint(keccak256(randomSeed, block.timestamp));
    }

    function getRandom(uint lim) internal returns (uint) {
        nextSeed();
        return randomSeed % lim;
    }
}

contract Player is Abstract {
    function transferCat(Cat storage cat, address newOwner) internal {
        require(cat.owner == msg.sender);

        // remove from profile
        uint[] storage ids = ownedCats[msg.sender];
        bool found = false;
        uint len = ids.length;
        for (uint i = 0; i + 1 < len; ++i) {
            if (ids[i] == cat.id) {
                found = true;
            }

            if (found) {
                ids[i] = ids[i + 1];
            }
        }
        ids.length--;

        // give to new owner
        receiveCat(cat, newOwner);
    }

    function receiveCat(Cat storage cat, address owner) internal {
        cat.owner = owner;
        ownedCats[owner].push(cat.id);
    }

    function getOwnedCats() external view returns (uint[]) {
        return ownedCats[msg.sender];
    }
}

contract CryptoCat is Player {
    function setExpPrice(uint price) external adminOnly {
        expPrice = price;
    }

    function createNewCat(
        address owner,
        bool isMale,
        uint8 element
    ) private returns (uint)
    {
        uint id = cats.length;
        Cat memory cat = Cat(
            id,
            owner,
            isMale,
            10,
            1,
            0,
            false,
            0,
            0
        );

        cats.push(cat);
        if (cat.isMale) {
            MaleCat storage maleInfo = maleCatInfo[id];
            maleInfo.element = element;
            maleInfo.atkPerLv = 1;
            maleInfo.defPerLv = 1;
            maleInfo.hpPerLv = 1;
            maleInfo.baseAtk = 1;
            maleInfo.baseDef = 1;
            maleInfo.baseHp = 1;
        } else {
            FemaleCat storage femaleInfo = femaleCatInfo[id];
            femaleInfo.breedFee = 1 ether;
            femaleInfo.lastBreed = block.timestamp;
        }

        receiveCat(cats[cat.id], owner);
        return id;
    }

    function addExp(uint catId, uint64 exp) internal {
        Cat storage cat = cats[catId];
        cat.exp += exp;

        while (cat.level < cat.levelCap) {
            uint64 expCap = uint64(1) << cat.level;
            if (cat.exp < expCap)
                break;

            cat.exp -= expCap;
            cat.level++;
        }
    }

    function getFreeCat(bool isMale, uint8 element) private adminOnly {
        createNewCat(msg.sender, isMale, element);
    }

    function getFreeCats(uint num, bool isMale, uint8 element) external adminOnly {
        for (uint i = 0; i < num; ++i)
            getFreeCat(isMale, element);
    }

    function buyInitCat(bool isMale, uint8 element) external payable {
        require(msg.value >= 0.1 ether);
        createNewCat(msg.sender, isMale, element);
    }

    function feedCat(uint catId) external payable {
        addExp(catId, uint64(msg.value / expPrice));
    }

    function breed(Cat dad, Cat mom) internal returns (uint) {
        require(dad.isMale && !mom.isMale);

        MaleCat storage dadInfo = maleCatInfo[dad.id];
        uint id = createNewCat(msg.sender, getRandom(2) == 1, dadInfo.element);

        uint boost = dad.level - mom.level;
        if (dad.level < mom.level) boost = mom.level - dad.level;
        if (boost <= 4) boost = 4 - boost; else boost = 1;

        if (cats[id].isMale) {
            cats[id].levelCap = mom.level;
            maleCatInfo[id].baseAtk = dadInfo.baseAtk + uint16(getRandom(boost * 5));
            maleCatInfo[id].baseDef = dadInfo.baseDef + uint16(getRandom(boost * 5));
            maleCatInfo[id].baseHp = dadInfo.baseHp + uint16(getRandom(boost * 5));
            maleCatInfo[id].atkPerLv = dadInfo.atkPerLv + uint16(getRandom(boost));
            maleCatInfo[id].defPerLv = dadInfo.defPerLv + uint16(getRandom(boost));
            maleCatInfo[id].hpPerLv = dadInfo.hpPerLv + uint16(getRandom(boost));
        } else {
            cats[id].levelCap = mom.level + uint8(getRandom(boost * 3));
            if (cats[id].levelCap > 40) cats[id].levelCap = 40;
        }

        return id;
    }
}

contract Marketplace is CryptoCat {
    function setBreedFee(uint catId, uint fee) public {
        require(cats[catId].owner == msg.sender);
        require(cats[catId].isMale == false);
        femaleCatInfo[catId].breedFee = fee;
    }

    function payForBreed(uint ownCatId, uint breedCatId) external payable {
        Cat storage ownCat = cats[ownCatId];
        Cat storage breedCat = cats[breedCatId];
        require(ownCat.owner == msg.sender);
        require(ownCat.isMale && !breedCat.isMale);
        require(msg.value >= femaleCatInfo[breedCatId].breedFee || breedCat.owner == msg.sender);

        breedCat.owner.transfer(msg.value);
        breed(ownCat, breedCat);
    }

    function startAuction(uint catId, uint startingPrice) public {
        Cat storage cat = cats[catId];
        require(cat.owner == msg.sender);

        cat.onAuction = true;
        cat.highestBid = startingPrice;
        cat.highestBidder = 0;
    }

    function endAuction(uint catId) public {
        Cat storage cat = cats[catId];
        require(cat.onAuction && cat.owner == msg.sender);

        cat.onAuction = false;
        if (cat.highestBidder != 0) {
            msg.sender.transfer(cat.highestBid);
            transferCat(cat, cat.highestBidder);
        }
    }

    function raiseBid(uint catId) external payable {
        Cat storage cat = cats[catId];
        require(cat.owner != msg.sender && cat.onAuction && cat.highestBid < msg.value);

        cat.highestBidder.transfer(cat.highestBid);
        cat.highestBid = msg.value;
        cat.highestBidder = msg.sender;
    }
}

contract CryptoCatWar is Marketplace {
    constructor() public {
        setAdmin(msg.sender);
    }

    function elementCountered(MaleCat info1, MaleCat info2) private pure returns (bool) {
        return (3 + info2.element - info1.element) == 1;
    }

    function timeTillDead(uint id1, uint id2) private view returns (uint) {
        MaleCat storage info1 = maleCatInfo[id1];
        MaleCat storage info2 = maleCatInfo[id2];

        uint atkMul = 10;
        if (elementCountered(info1, info2)) atkMul = 12;
        if (elementCountered(info2, info1)) atkMul = 8;

        uint hp = (info1.baseHp + (cats[id1].level - 1)) * info1.hpPerLv * 10;
        uint def = (info1.baseDef + (cats[id1].level - 1)) * info1.defPerLv * 10;
        uint dmg = (info2.baseAtk + (cats[id2].level - 1)) * info2.atkPerLv * atkMul;

        if (def >= dmg) return uint(-1);
        return (hp + dmg - def - 1) / (dmg - def);
    }

    function attackCat(uint ownCatId, uint atkCatId) public {
        require(cats[ownCatId].owner == msg.sender);
        require(cats[atkCatId].owner != msg.sender);

        uint ownTime = timeTillDead(ownCatId, atkCatId);
        uint atkTime = timeTillDead(atkCatId, ownCatId);

        if (atkTime != uint(-1) && ownTime >= atkTime) {
            addExp(ownCatId, uint64(1) << (cats[atkCatId].level - 1));
        }
    }
}