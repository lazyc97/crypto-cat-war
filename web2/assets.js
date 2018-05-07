import Ethers from 'ethers';

export const IMAGES = {
  welcomeImage: require('../web/assets/images/homebg.jpg'),
  auctionIcon: require('./assets/auction.svg'),
  loveIcon: require('./assets/valentines-heart.svg'),
  battleIcon: require('./assets/swords-crossed.svg'),
  ethereumIcon: require('./assets/ethereum.svg'),
  coinsIcon: require('./assets/coins.svg'),
  shoppingIcon: require('./assets/shopping-cart.svg'),

  femaleCatIcons: [
    require('../web/assets/images/cats/female/0.png'),
    require('../web/assets/images/cats/female/1.png'),
    require('../web/assets/images/cats/female/2.png'),
    require('../web/assets/images/cats/female/3.png'),
  ],
  fireCatIcons: [
    require('../web/assets/images/cats/fire/0.jpg'),
    require('../web/assets/images/cats/fire/1.jpg'),
    require('../web/assets/images/cats/fire/2.jpg'),
    require('../web/assets/images/cats/fire/3.jpg'),
  ],
  waterCatIcons: [
    require('../web/assets/images/cats/water/0.jpg'),
    require('../web/assets/images/cats/water/1.jpg'),
    require('../web/assets/images/cats/water/2.jpg'),
    require('../web/assets/images/cats/water/3.jpg'),
  ],
  windCatIcons: [
    require('../web/assets/images/cats/wind/0.jpg'),
    require('../web/assets/images/cats/wind/1.jpg'),
    require('../web/assets/images/cats/wind/2.jpg'),
    require('../web/assets/images/cats/wind/3.jpg'),
  ]
};

export const DEFAULT_ETHERS_PROVIDER = new Ethers.providers.JsonRpcProvider('http://localhost:7545');
export const CONTRACT_JSON = require('./assets/contracts/CryptoCatWar.json');

export const CAT_ELEMENTS = [
  'Fire',
  'Water',
  'Wind',
]