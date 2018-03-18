pragma solidity ^0.4.18;

import "./CryptoCat.sol";

contract Marketplace is CryptoCat {
    event AuctionEnd(uint indexed catId);

    function setBreedFee(uint catId, uint fee) public {
        Cat storage cat = cats[catId];
        require(cat.owner == msg.sender);
        cat.breedFee = fee;
    }

    function payForBreed(uint ownCatId, uint breedCatId) external payable {
        Cat storage ownCat = cats[ownCatId];
        Cat storage breedCat = cats[breedCatId];
        require(ownCat.owner == msg.sender);
        require(msg.value >= breedCat.breedFee);
        require(ownCat.isMale != breedCat.isMale);

        breedCat.owner.transfer(msg.value);
        if (ownCat.isMale)
            breed(ownCat, breedCat);
        else
            breed(breedCat, ownCat);
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
            auctionDeposits[catId][cat.highestBidder] = 0;
            transferCat(cat, cat.highestBidder);
        }

        emit AuctionEnd(catId);
    }

    function raiseBid(uint catId) external payable {
        Cat storage cat = cats[catId];
        require(cat.onAuction && cat.highestBid < auctionDeposits[catId][msg.sender] + msg.value);

        auctionDeposits[catId][msg.sender] += msg.value;
        cat.highestBid = auctionDeposits[catId][msg.sender];
        cat.highestBidder = msg.sender;
    }

    function drawEther(uint catId) external {
        msg.sender.transfer(auctionDeposits[catId][msg.sender]);
        auctionDeposits[catId][msg.sender] = 0;
    }

    function getCurrentBid(uint catId) external view returns (uint) {
        return auctionDeposits[catId][msg.sender];
    }

    function getCatMarketInfo(uint catId) external view returns (
        uint breedFee,
        uint32 lastBreed,
        bool onAuction,
        uint highestBid,
        address highestBidder
    ) {
        Cat storage cat = cats[catId];
        return (
            cat.breedFee,
            cat.lastBreed,
            cat.onAuction,
            cat.highestBid,
            cat.highestBidder
        );
    }
}