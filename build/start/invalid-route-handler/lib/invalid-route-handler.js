'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _approximator = require('../../../lib/approximator');

var _approximator2 = _interopRequireDefault(_approximator);

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _fragment = require('../../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  if (_fragment2.default.toState()) {
    return;
  }

  var hash = _fragment2.default.get();
  var stateName = _approximator2.default.fromHash(hash);

  if (stateName) {
    stateName += '.noop';
  }

  stateName = _approximator2.default.fromStateName('error', stateName);

  if (!stateName) {
    return alert('Provided route [' + hash + '] is invalid');
  }

  _instance2.default.activate({ name: stateName, direct: { fragment: hash } }).catch(_lodash2.default.noop);
};