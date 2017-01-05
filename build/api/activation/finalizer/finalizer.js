'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  if (_vars2.default.states.registry[_vars2.default.rootStateName].showRuntime) {
    console.log('%cruntime: ' + (Date.now() - stateParams.time) + 'ms', 'color: green;');
  }
};