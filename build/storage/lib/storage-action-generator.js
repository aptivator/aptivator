"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (storage, setter) {
  return setter ? function (key, val) {
    return storage.setItem(key, JSON.stringify(val));
  } : function (key, val) {
    return val = storage.getItem(key), val ? JSON.parse(val) : val;
  };
};