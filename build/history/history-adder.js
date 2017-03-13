'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vars = require('../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var history = _vars2.default.states.history;

exports.default = function (state) {
  history.push(state);
  history.splice(0, history.length - _vars2.default.configs.historySize);
};