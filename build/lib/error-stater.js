'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _approximator = require('./approximator');

var _approximator2 = _interopRequireDefault(_approximator);

var _aptivator = require('./aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _fragment = require('./fragment');

var _fragment2 = _interopRequireDefault(_fragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var hash = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _fragment2.default.get();

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

  _aptivator2.default.activate({ stateName: stateName, route: { fragment: hash } }).catch(_lodash2.default.noop);
};