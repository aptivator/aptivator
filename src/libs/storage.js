import aptivator from './instance';

let storageAction = (storage, setter) => 
  setter ? (key, val) => storage.setItem(key, JSON.stringify(val)) :
    (key, val) => (val = storage.getItem(key), val ? JSON.parse(val) : val);

aptivator.m = new Map();

aptivator.s = {
  get: storageAction(sessionStorage),
  set: storageAction(sessionStorage, true)
};

aptivator.l = {
  get: storageAction(localStorage),
  set: storageAction(localStorage, true)
};
