'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _approximator = require('../../lib/approximator');

var _approximator2 = _interopRequireDefault(_approximator);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _fragment = require('../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _route = require('../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _dataStores = require('./lib/data-stores');

var _dataStores2 = _interopRequireDefault(_dataStores);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

exports.default = function (stateParams) {
  return new Promise(function (resolve, reject) {
    stateParams.directParams = stateParams.direct;
    stateParams.routeParams = stateParams.route;
    stateParams.stateName = stateParams.name;

    var stateName = stateParams.stateName,
        routeParams = stateParams.routeParams,
        routeValues = stateParams.routeValues,
        silent = stateParams.silent;

    var stateConfigs = registry[stateName];
    var rootStateConfigs = registry[_vars2.default.rootStateName];

    if (rootStateConfigs.showRuntime) {
      stateParams.time = Date.now();
    }

    if (!stateConfigs) {
      _error2.default.throw('invalid [' + stateName + '] state name', 'initializer');
    }

    var transientStateName = _approximator2.default.fromStateName('transient', stateName);

    if (transientStateName && transientStateName !== stateName) {
      (function () {
        var activationPromise = { promise: undefined };
        var defaults = { useResolves: false, keepLast: false };
        var immutableDefaults = { noHistory: true, name: transientStateName };
        var transientStateConfigs = registry[transientStateName];
        var transient = transientStateConfigs.transient;

        var transientConfigs = _lodash2.default.isObject(transient) ? transient : {};
        var delay = transientConfigs.delay || rootStateConfigs.transientDelay || 300;
        var activationParams = _lodash2.default.extend(defaults, _lodash2.default.pick(transientConfigs, _lodash2.default.keys(defaults)), immutableDefaults);
        var timeoutHandle = setTimeout(function () {
          return (activationPromise.promise = _instance2.default.activate(activationParams).then(_lodash2.default.noop, function (e) {
            return Promise.reject(e);
          })).catch(_lodash2.default.noop);
        }, delay);

        stateParams.transient = { activationPromise: activationPromise, activationParams: activationParams, timeoutHandle: timeoutHandle };
      })();
    }

    if (!routeValues) {
      routeValues = stateConfigs.routeValues;
    }

    if (!stateConfigs.route) {
      silent = true;
    }

    if (!routeParams || _lodash2.default.isEmpty(routeParams)) {
      stateParams.routeParams = _route2.default.parts.assemble(stateName, routeValues);

      if (!silent) {
        _fragment2.default.set(stateParams.routeParams.fragment);
      }
    }

    _lodash2.default.extend(stateParams, _dataStores2.default);

    resolve(stateParams);
  });
};