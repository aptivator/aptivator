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

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  _vars2.default.router.route('*error', function (hash) {
    if (!hash) {
      return;
    }

    var stateName = _approximator2.default.fromHash(hash);

    if (stateName) {
      stateName += '.noop';
    }

    stateName = _approximator2.default.fromStateName('error', stateName);

    if (!stateName) {
      return alert('Provided route [' + hash + '] is invalid');
    }

    _instance2.default.activate({ stateName: stateName, route: { fragment: hash } }).catch(_lodash2.default.noop);
  });
};