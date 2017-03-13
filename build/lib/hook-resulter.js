'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (hookName, stateParams, results) {
  _lodash2.default.extend(stateParams.flags, (0, _defineProperty3.default)({}, hookName, true));

  if (_lodash2.default.isEmpty(results)) {
    return;
  }

  var hooks = stateParams.hooks;


  if (!hooks) {
    _lodash2.default.set(stateParams, 'hooks', hooks = {});
  }

  _lodash2.default.extend(hooks, results);
};