pragma solidity ^0.4.19;

import "./Admin.sol";

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