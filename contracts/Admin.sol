pragma solidity ^0.4.19;

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