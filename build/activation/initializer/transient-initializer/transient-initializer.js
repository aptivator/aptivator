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

exports.default = function (stateName) {
  var transient = _vars2.default.states.registry[stateName].transient;

  var _ref = _lodash2.default.isObject(transient) ? transient : {},
      delay = _ref.delay;

  var stateParams = { stateName: stateName, owners: new Set(), flags: { parallel: false, transient: true } };
  var transientConfigs = stateParams.transientConfigs = {};

  if (!_lodash2.default.isNumber(delay)) {
    var transientDelay = _vars2.default.configs.transientDelay;

    delay = _lodash2.default.isNumber(transientDelay) ? transientDelay : _vars2.default.transientDelay;
  }

  if (_lodash2.default.isObject(transient)) {
    _lodash2.default.extend(stateParams.flags, _lodash2.default.pick(transient, ['noResolves']));
  }

  transientConfigs.timeout = setTimeout(function () {
    var promise = _instance2.default.activate(stateParams);
    promise = promise.then(_lodash2.default.noop, function (e) {
      return Promise.reject(e);
    });
    _lodash2.default.extend(transientConfigs, { promise: promise });
    promise.catch(_lodash2.default.noop);
  }, delay);

  return stateParams;
};