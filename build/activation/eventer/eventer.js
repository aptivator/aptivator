'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aptivator = require('../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

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

      _aptivator2.default.trigger({ handle: handle, full: true }, stateParams).then(function (results) {
        (0, _hookResulter2.default)(hookName, stateParams, results);

        if (sync) {
          return resolve(stateParams);
        }
      }, function (e) {
        return reject({ type: e, stateParams: stateParams });
      });
    });
  };
};