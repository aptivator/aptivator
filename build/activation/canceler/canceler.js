'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (stateParams) {
  var stateName = stateParams.stateName;
  var _stateParams$flags = stateParams.flags,
      duplicateSerial = _stateParams$flags.duplicateSerial,
      canceled = _stateParams$flags.canceled;


  if (duplicateSerial) {
    throw {
      type: 'duplicate',
      message: 'state [' + stateName + '] is serial and cannot be activated with another serial state',
      stateParams: stateParams
    };
  }

  if (canceled) {
    throw {
      type: 'canceled',
      message: 'state [' + stateName + '] was canceled',
      stateParams: stateParams
    };
  }
};