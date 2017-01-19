'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _historyAdder = require('../../history/history-adder');

var _historyAdder2 = _interopRequireDefault(_historyAdder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  if (!stateParams.noHistory) {
    (0, _historyAdder2.default)(_lodash2.default.cloneDeep(stateParams));
  }

  return stateParams;
};