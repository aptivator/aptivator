'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _historyAdder = require('../../history/history-adder');

var _historyAdder2 = _interopRequireDefault(_historyAdder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    if (!stateParams.flags) {
      stateParams.flags = {};
    }

    if (stateParams.name) {
      stateParams.stateName = stateParams.name;
      delete stateParams.name;
    }

    console.log('started ' + stateParams.stateName);

    stateParams.hooks = {};
    (0, _historyAdder2.default)(stateParams);

    resolve(stateParams);
  });
};