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

var _transientInitializer = require('./transient-initializer/transient-initializer');

var _transientInitializer2 = _interopRequireDefault(_transientInitializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

exports.default = function (stateParams) {
  if (!stateParams.flags) {
    stateParams.flags = {};
  }

  var flags = stateParams.flags,
      route = stateParams.route,
      routeValues = stateParams.routeValues,
      stateName = stateParams.stateName;
  var parallel = flags.parallel,
      silent = flags.silent,
      transient = flags.transient;

  var stateConfigs = registry[stateName];

  if (!stateConfigs) {
    _error2.default.throw('invalid [' + stateName + '] state name', 'initializer');
  }

  stateParams.hooks = {};

  _lodash2.default.extend(stateParams.flags, { active: false, pending: true });

  if (_vars2.default.configs.showRuntime && !transient) {
    stateParams.time = _lodash2.default.now();
  }

  if (!transient) {
    (function () {
      var transientStateName = _approximator2.default.fromStateName('transient', stateName);

      if (transientStateName) {
        var transientStateParams = _instance2.default.history.getOne(function (stateParams) {
          var stateName = stateParams.stateName,
              flags = stateParams.flags;
          var active = flags.active,
              pending = flags.pending;


          if (stateName === transientStateName && (active || pending)) {
            return true;
          }
        });

        if (transientStateParams) {
          var owners = transientStateParams.owners,
              currentOwners = transientStateParams.currentOwners;

          var ownerStateParams = owners[owners.length - 1];
          var transientConfigs = ownerStateParams.transientConfigs;


          _lodash2.default.extend(stateParams, { transientConfigs: transientConfigs });
          owners.push(stateParams);
          currentOwners.add(stateParams);
        } else {
          stateParams.transientConfigs = (0, _transientInitializer2.default)(transientStateName, stateParams);
        }
      }
    })();
  }

  if (!(parallel || transient)) {
    var pending = _instance2.default.history.get(function (stateParams) {
      var stateNameInner = stateParams.stateName,
          flags = stateParams.flags;
      var pending = flags.pending,
          parallel = flags.parallel,
          transient = flags.transient;


      if (!parallel && pending && !transient && stateNameInner !== stateName) {
        return true;
      }
    });

    pending.forEach(function (stateParams) {
      return stateParams.flags.canceled = true;
    });
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

  return stateParams;
};