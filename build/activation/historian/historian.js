'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    if (!stateParams.noHistory) {
      _instance2.default.history.add(_lodash2.default.cloneDeep(stateParams));
    }

    resolve(stateParams);
  });
};