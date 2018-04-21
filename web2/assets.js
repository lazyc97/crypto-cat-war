import Ethers from 'ethers';

export const images = {
  welcomeImage: require('../web/assets/images/homebg.jpg'),
  auctionIcon: require('./assets/auction.svg'),
  loveIcon: require('./assets/valentines-heart.svg'),
  battleIcon: require('./assets/swords-crossed.svg'),
  ethereumIcon: require('./assets/ethereum.svg'),
  coinsIcon: require('./assets/coins.svg'),
  shoppingIcon: require('./assets/shopping-cart.svg'),

  femaleCatIcons: [
    require('../web/assets/images/cats/female/0.png')
  ]
};

export const DEFAULT_ETHERS_PROVIDER = new Ethers.providers.JsonRpcProvider('http://localhost:7545');
export const CONTRACT_JSON = require('../web/assets/contracts/CryptoCatWar.json');