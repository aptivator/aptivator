export default (storage, setter) => 
  setter ? (key, val) => storage.setItem(key, JSON.stringify(val)) :
    (key, val) => (val = storage.getItem(key), val ? JSON.parse(val) : val);
