'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    if (_vars2.default.states.registry[_vars2.default.rootStateName].showRuntime) {
      console.log('%cruntime: ' + (Date.now() - stateParams.time) + 'ms', 'color: green;');
    }

    if (!stateParams.noHistory) {
      _instance2.default.history.set(_lodash2.default.cloneDeep(stateParams));
    }

    resolve();
  });
};