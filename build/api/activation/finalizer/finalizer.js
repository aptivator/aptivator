'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _error = require('../../../libs/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../../../libs/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (err, stateParams) {
  var rootStateConfigs = _vars2.default.states.registry[_vars2.default.rootStateName];

  if (err) {
    console.error(_error2.default.message(err));
  }

  if (rootStateConfigs.showRuntime) {
    console.log('runtime: ' + (Date.now() - stateParams.time) + 'ms');
  }
};