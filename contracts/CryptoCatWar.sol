pragma solidity ^0.4.19;

import "./Marketplace.sol";

contract CryptoCatWar is Marketplace {
    function CryptoCatWar() public {
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