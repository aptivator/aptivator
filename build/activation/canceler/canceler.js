'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (stateParams) {
  if (stateParams.cancel) {
    throw 'cancel';
  }
  return stateParams;
};