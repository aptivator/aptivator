'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    var _ref = _instance2.default.history.last() || {},
        stateName = _ref.stateName;

    if (stateName) {
      _instance2.default.deactivate({ name: stateName });
    }

    resolve(stateParams);
  });
};