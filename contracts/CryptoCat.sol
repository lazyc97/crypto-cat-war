pragma solidity ^0.4.19;

import "./Player.sol";

contract CryptoCat is Player {
    function setExpPrice(uint price) external adminOnly {
        expPrice = price;
    }

    function createNewCat(
        address owner,
        bool isMale,
        uint64 levelCap
    ) private
    {
        uint id = cats.length;
        Cat memory cat = Cat(
            id,
            owner,
            isMale,
            levelCap,
            1,
            0,
            false,
            0,
            0
        );

        cats.push(cat);
        if (cat.isMale) {
            MaleCat storage maleInfo = maleCatInfo[id];
            maleInfo.element = 0;
            maleInfo.atkPerLv = 1;
            maleInfo.defPerLv = 1;
            maleInfo.hpPerLv = 1;
            maleInfo.baseAtk = 1;
            maleInfo.baseDef = 1;
            maleInfo.baseHp = 1;
        } else {
            FemaleCat storage femaleInfo = femaleCatInfo[id];
            femaleInfo.breedFee = 1 ether;
            femaleInfo.lastBreed = uint32(block.timestamp);
        }

        receiveCat(cat, owner);
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

    function getFreeCat(bool isMale) private adminOnly {
        createNewCat(msg.sender, isMale, 10);
    }

    function getFreeCats(uint num, bool isMale) external adminOnly {
        for (uint i = 0; i < num; ++i)
            getFreeCat(isMale);
    }

    function feedCat(uint catId) external payable {
        addExp(catId, uint64(msg.value / expPrice));
    }

    function breed(Cat dad, Cat mom) internal returns (uint) {
        require(dad.isMale && !mom.isMale);

        // TODO: mix attributes of mom and dad to create child.
        createNewCat(msg.sender, true, 10);
    }
}