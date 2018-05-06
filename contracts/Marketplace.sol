pragma solidity ^0.4.19;

import "./CryptoCat.sol";

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