'use strict';

var _instance = require('./instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storageAction = function storageAction(storage, setter) {
  return setter ? function (key, val) {
    return storage.setItem(key, JSON.stringify(val));
  } : function (key, val) {
    return val = storage.getItem(key), val ? JSON.parse(val) : val;
  };
};

_instance2.default.m = new Map();

_instance2.default.s = {
  get: storageAction(sessionStorage),
  set: storageAction(sessionStorage, true)
};

_instance2.default.l = {
  get: storageAction(localStorage),
  set: storageAction(localStorage, true)
};