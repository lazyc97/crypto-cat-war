var CryptoCatWar = artifacts.require("./CryptoCatWar.sol");

module.exports = function(deployer) {
  deployer.deploy(CryptoCatWar);
};
