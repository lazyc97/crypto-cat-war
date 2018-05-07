import Ethers from 'ethers';
import $ from 'jquery';

import { CONTRACT_JSON, IMAGES } from './assets';

export const setupContract = (wallet) => {
  wallet.provider = new Ethers.providers.JsonRpcProvider('http://localhost:7545');

  const address = CONTRACT_JSON['networks']['5777']['address'];
  const abi = CONTRACT_JSON['abi'];
  window.MainContract = new Ethers.Contract(address, abi, wallet);
  console.log(MainContract);
  localStorage.setItem('privateKey', wallet.privateKey);
}

export const setCatPropsByLevel = (info) => {
  return Object.assign(info, {
    atk: info.baseAtk + (info.level - 1) * info.atkPerLv,
    def: info.baseDef + (info.level - 1) * info.defPerLv,
    hp: info.baseHp + (info.level - 1) * info.hpPerLv,
  });
}

export const getFullCatData = async (id) => {
  const infos = await Promise.all([
    MainContract.cats(id),
    MainContract.maleCatInfo(id),
    MainContract.femaleCatInfo(id),
  ]);

  return setCatPropsByLevel(Object.assign(infos[0], infos[0].isMale ? infos[1] : infos[2]));
}

export const getCatIcon = (info) => {
  const grade = Math.floor((info.level - 1) / 10);
  if (!info.isMale) return IMAGES.femaleCatIcons[grade];
  switch (info.element) {
    case 0: return IMAGES.fireCatIcons[grade];
    case 1: return IMAGES.waterCatIcons[grade];
    case 2: return IMAGES.windCatIcons[grade];
    default: return '';
  }
}

export const showMessageDialog = (title, content) => {
  return new Promise((resolve, reject) => {
    $('#message-modal-title').text(title);
    $('#message-modal-content').text(content);
    $('#message-modal-close').click(resolve);
    $('#message-modal').modal({
      backdrop: 'static',
    });
  });
}

export const showConfirmDialog = (title, content) => {
  return new Promise((resolve, reject) => {
    $('#confirm-modal-title').text(title);
    $('#confirm-modal-content').text(content);
    $('#confirm-modal-yes').click(() => resolve(true));
    $('#confirm-modal-no').click(() => resolve(false));
    $('#confirm-modal').modal({
      backdrop: 'static',
    });
  });
}

export const showTextInputDialog = (title, label, defaultInput) => {
  return new Promise((resolve, reject) => {
    $('#text-input-modal-title').text(title);
    $('#text-input-modal-label').text(label);
    $('#text-input-modal-input').val(defaultInput);
    $('#text-input-modal-confirm').click(() => {
      const text = $('#text-input-modal-input').val();
      resolve(text);
    });
    $('#text-input-modal-close').click(() => resolve(null));
    $('#text-input-modal').modal({
      backdrop: 'static',
    });
  });
}