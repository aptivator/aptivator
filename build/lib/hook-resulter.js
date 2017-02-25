'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams, hookName, results) {
  if (_lodash2.default.isEmpty(results)) {
    return;
  }

  var hookValues = _lodash2.default.get(results, [hookName, 'v'], {});
  var hookStateValues = _lodash2.default.get(results, [hookName, stateParams.stateName, 'v'], {});

  results[hookName] = _lodash2.default.extend(hookValues, hookStateValues);

  if (!stateParams.hooks) {
    stateParams.hooks = {};
  }

  _lodash2.default.extend(stateParams.hooks, results);
};