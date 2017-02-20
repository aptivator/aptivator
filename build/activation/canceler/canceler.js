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
      errorType: 'duplicate-serial',
      errorMessage: 'state [' + stateName + '] is serial and cannot be activated with another serial state',
      stateParams: stateParams
    };
  }

  if (canceled) {
    throw {
      errorType: 'canceled',
      errorMessage: 'state [' + stateName + '] was canceled',
      stateParams: stateParams
    };
  }
};