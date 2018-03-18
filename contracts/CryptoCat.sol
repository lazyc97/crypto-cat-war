pragma solidity ^0.4.18;

import "./Player.sol";

contract CryptoCat is Player {
    function setExpPrice(uint price) external adminOnly {
        expPrice = price;
    }

    function createNewCat(
        address owner,
        bool isMale,
        uint8 element,
        uint64 levelCap,
        uint16 atkPerLv,
        uint16 defPerLv,
        uint16 hpPerLv,
        uint16 baseAtk,
        uint16 baseDef,
        uint16 baseHp
    ) private
    {
        uint id = cats.length;
        cats.push(
            Cat(
                id,
                owner,
                isMale,
                element,
                levelCap,
                atkPerLv,
                defPerLv,
                hpPerLv,
                baseAtk,
                baseDef,
                baseHp,
                1,
                0,
                1 finney,
                0,
                false,
                0,
                0
            )
        );

        receiveCat(cats[id], owner);
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

    function getFreeCat(bool isMale) external adminOnly {
        createNewCat(msg.sender, isMale, 0, 10, 1, 1, 5, 1, 1, 2);
    }

    function feedCat(uint catId) external payable {
        addExp(catId, uint64(msg.value / expPrice));
    }

    function breed(Cat dad, Cat mom) internal returns (uint) {
        require(dad.isMale && !mom.isMale);

        // TODO: mix attributes of mom and dad to create child.
        createNewCat(msg.sender, true, 0, 10, 1, 1, 5, 1, 1, 2);
    }

    function getCatInfo(uint catId) external view returns (
        uint id,
        address owner,
        bool isMale,
        uint8 element,
        uint64 levelCap,
        uint16 atkPerLv,
        uint16 defPerLv,
        uint16 hpPerLv,
        uint16 baseAtk,
        uint16 baseDef,
        uint16 baseHp,
        uint8 level,
        uint64 exp
    ) {
        Cat storage cat = cats[catId];
        return (
            cat.id,
            cat.owner,
            cat.isMale,
            cat.element,
            cat.levelCap,
            cat.atkPerLv,
            cat.defPerLv,
            cat.hpPerLv,
            cat.baseAtk,
            cat.baseDef,
            cat.baseHp,
            cat.level,
            cat.exp
        );
    }
}