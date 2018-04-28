import Ethers from 'ethers';

import { CONTRACT_JSON } from './assets';

export const setupContract = (wallet) => {
  wallet.provider = new Ethers.providers.JsonRpcProvider('http://localhost:7545');

  const address = CONTRACT_JSON['networks']['5777']['address'];
  const abi = CONTRACT_JSON['abi'];
  window.MainContract = new Ethers.Contract(address, abi, wallet);
  console.log(MainContract);
  localStorage.setItem('privateKey', wallet.privateKey);
}