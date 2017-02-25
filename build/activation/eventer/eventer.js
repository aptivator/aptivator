'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _hookResulter = require('../../lib/hook-resulter');

var _hookResulter2 = _interopRequireDefault(_hookResulter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var syncHookNames = ['start', 'loading'];

exports.default = function (hookName) {
  return function (stateParams) {
    return new Promise(function (resolve, reject) {
      var stateName = stateParams.stateName;

      var handle = hookName + ':' + stateName;
      var sync = syncHookNames.includes(hookName);

      if (!sync) {
        resolve(stateParams);
      }

      _instance2.default.trigger({ handle: handle, full: true }, stateParams).then(function (results) {
        _lodash2.default.extend(stateParams.flags, (0, _defineProperty3.default)({}, hookName, true));

        (0, _hookResulter2.default)(stateParams, hookName, results);

        if (sync) {
          resolve(stateParams);
        }
      }, function (e) {
        return reject({ errorType: e, stateParams: stateParams });
      });
    });
  };
};