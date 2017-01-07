'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    var lastStateParams = _instance2.default.history.last();

    if (lastStateParams) {
      console.log('last state: ' + lastStateParams.stateName);
    }

    resolve(stateParams);
  });
};