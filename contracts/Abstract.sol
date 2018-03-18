pragma solidity ^0.4.18;

import "./Admin.sol";

contract Abstract is Admin {
    struct Cat {
        uint id;
        address owner;

        bool isMale;
        uint8 element;
        uint64 levelCap;
        uint16 atkPerLv;
        uint16 defPerLv;
        uint16 hpPerLv;
        uint16 baseAtk;
        uint16 baseDef;
        uint16 baseHp;

        uint8 level;
        uint64 exp;

        uint breedFee;
        uint32 lastBreed;

        bool onAuction;
        uint highestBid;
        address highestBidder;
    }

    uint expPrice = (1 ether) / 1000000;
    Cat[] cats;

    mapping(address => uint[]) ownedCats;
    mapping(uint => mapping(address => uint)) auctionDeposits;
}