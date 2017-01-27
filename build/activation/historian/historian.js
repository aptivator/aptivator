'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _historyAdder = require('../../history/history-adder');

var _historyAdder2 = _interopRequireDefault(_historyAdder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  if (!stateParams.noHistory) {
    (0, _historyAdder2.default)(stateParams);
  }

  return stateParams;
};