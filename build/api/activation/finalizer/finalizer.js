'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (err, stateParams) {
  var rootStateConfigs = _vars2.default.states.registry[_vars2.default.rootStateName];

  if (rootStateConfigs.showRuntime) {
    console.log('runtime: ' + (Date.now() - stateParams.time) + 'ms');
  }

  if (err) {
    _error2.default.throw(err);
  }
};