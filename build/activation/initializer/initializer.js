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

var _transientInitializer = require('./lib/transient-initializer');

var _transientInitializer2 = _interopRequireDefault(_transientInitializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var states = _vars2.default.states;
var pending = states.pending,
    registry = states.registry;

exports.default = function (stateParams) {
  var ignorePending = stateParams.ignorePending,
      route = stateParams.route,
      routeValues = stateParams.routeValues,
      silent = stateParams.silent,
      stateName = stateParams.stateName;

  var stateConfigs = registry[stateName];

  if (!stateConfigs) {
    _error2.default.throw('invalid [' + stateName + '] state name', 'initializer');
  }

  delete stateParams.noResolves;

  var transient = stateConfigs.transient;


  stateParams.isTransient = !!transient;

  if (_vars2.default.configs.showRuntime && !transient) {
    stateParams.time = _lodash2.default.now();
  }

  if (!ignorePending) {
    pending.forEach(function (stateParams) {
      var stateName = stateParams.stateName;

      stateParams.cancel = true;
      _instance2.default.deactivate({ name: stateName });
    });

    if (states.activeTransient) {
      _instance2.default.deactivate({ name: states.activeTransient });
    }
  }

  if (!transient) {
    var transientStateName = _approximator2.default.fromStateName('transient', stateName);
    if (transientStateName) {
      stateParams.transient = (0, _transientInitializer2.default)(transientStateName);
    }
  }

  if (_lodash2.default.isObject(transient)) {
    _lodash2.default.extend(stateParams, _lodash2.default.pick(transient, ['noResolves']));
  }

  if (stateConfigs.route && !route) {
    if (!routeValues) {
      routeValues = stateConfigs.routeValues;
    }

    route = _route2.default.parts.assemble(stateName, routeValues);

    if (!silent) {
      _fragment2.default.set(route.fragment);
    }

    _lodash2.default.extend(stateParams, { route: route });
  }

  pending.add(stateParams);

  return stateParams;
};