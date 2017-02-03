'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  var stateName = stateParams.stateName,
      flags = stateParams.flags;


  if (flags.canceled) {
    _instance2.default.deactivate({ name: stateName, stateParams: stateParams });
    throw 'canceled';
  }

  return stateParams;
};