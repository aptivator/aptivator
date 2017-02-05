'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (stateParams) {
  var _stateParams$flags = stateParams.flags,
      undeclared = _stateParams$flags.undeclared,
      duplicateSerial = _stateParams$flags.duplicateSerial,
      canceled = _stateParams$flags.canceled;


  if (undeclared) {
    throw 'undeclared';
  }

  if (duplicateSerial) {
    throw 'duplicate-serial';
  }

  if (canceled) {
    throw 'canceled';
  }

  return stateParams;
};