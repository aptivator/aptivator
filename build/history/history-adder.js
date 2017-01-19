'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vars = require('../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _statesCache = require('./lib/states-cache');

var _statesCache2 = _interopRequireDefault(_statesCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (state) {
  _statesCache2.default.push(state);
  _statesCache2.default.splice(0, _statesCache2.default.length - _vars2.default.configs.historySize);
};