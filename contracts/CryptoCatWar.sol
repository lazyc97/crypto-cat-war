pragma solidity ^0.4.19;

import "./Marketplace.sol";

contract CryptoCatWar is Marketplace {
    function CryptoCatWar() public {
        setAdmin(msg.sender);
    }
}