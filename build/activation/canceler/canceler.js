'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleName = 'canceler';

exports.default = function (stateParams) {
  var stateName = stateParams.stateName;
  var _stateParams$flags = stateParams.flags,
      duplicateSerial = _stateParams$flags.duplicateSerial,
      canceled = _stateParams$flags.canceled;


  if (duplicateSerial) {
    return !_error2.default.warn('state [' + stateName + '] is serial and cannot be activated with another serial state', moduleName);
  }

  if (canceled) {
    return !_error2.default.warn('state [' + stateName + '] was canceled', moduleName);
  }
};