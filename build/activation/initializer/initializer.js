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

var _fragment = require('../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _route = require('../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _serialStatesNormalizer = require('./serial-states-normalizer/serial-states-normalizer');

var _serialStatesNormalizer2 = _interopRequireDefault(_serialStatesNormalizer);

var _transientInitializer = require('./transient-initializer/transient-initializer');

var _transientInitializer2 = _interopRequireDefault(_transientInitializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    var transient = stateParams.flags.transient;


    _lodash2.default.extend(stateParams.flags, { active: false, pending: true });

    _instance2.default.on('goto-preprocessor', function () {
      return resolve(stateParams);
    });

    var startingStates = _instance2.default.history.get(function (stateParams) {
      var active = stateParams.flags.active;

      if (_lodash2.default.isUndefined(active)) {
        return true;
      }
    });

    if (startingStates.length) {
      return;
    }

    var startedStates = _instance2.default.history.get(function (stateParams) {
      var _stateParams$flags = stateParams.flags,
          active = _stateParams$flags.active,
          pending = _stateParams$flags.pending,
          preprocessed = _stateParams$flags.preprocessed,
          canceled = _stateParams$flags.canceled;


      if (active === false && pending && !preprocessed && !canceled) {
        return true;
      }
    });

    var undeclaredStates = startedStates.filter(function (stateParams) {
      var flags = stateParams.flags,
          stateName = stateParams.stateName;


      if (!registry[stateName]) {
        _lodash2.default.extend(flags, { active: false, canceled: true, pending: false, undeclared: true });
        return true;
      }
    });

    if (!transient) {
      startedStates = _lodash2.default.difference(startedStates, undeclaredStates);
      startedStates = (0, _serialStatesNormalizer2.default)(startedStates);

      var transientStates = _instance2.default.history.get(function (stateParams) {
        var _stateParams$flags2 = stateParams.flags,
            active = _stateParams$flags2.active,
            pending = _stateParams$flags2.pending,
            canceled = _stateParams$flags2.canceled,
            transient = _stateParams$flags2.transient;

        if (transient && (active || pending) && !canceled) {
          return true;
        }
      }).reduce(function (o, stateParams) {
        return o[stateParams.stateName] = stateParams, o;
      }, {});

      startedStates.forEach(function (stateParams) {
        var flags = stateParams.flags,
            route = stateParams.route,
            routeValues = stateParams.routeValues,
            stateName = stateParams.stateName;
        var parallel = flags.parallel,
            silent = flags.silent;

        var stateConfigs = registry[stateName];
        var transientStateName = _approximator2.default.fromStateName('transient', stateName);

        if (transientStateName) {
          var transientStateParams = transientStates[transientStateName];
          if (!transientStateParams) {
            transientStateParams = (0, _transientInitializer2.default)(transientStateName);
            transientStates[transientStateName] = transientStateParams;
          }

          transientStateParams.owners.add(stateParams);
          _lodash2.default.extend(stateParams, { transientStateParams: transientStateParams });
        }

        if (stateConfigs.route && !route) {
          if (!routeValues) {
            routeValues = stateConfigs.routeValues;
          }

          route = _route2.default.parts.assemble(stateName, routeValues);

          if (!(silent || parallel)) {
            _fragment2.default.set(route.fragment);
          }

          _lodash2.default.extend(stateParams, { route: route });
        }
      });

      if (_vars2.default.configs.showRuntime) {
        stateParams.time = _lodash2.default.now();
      }
    }

    _instance2.default.trigger('goto-preprocessor');
    _instance2.default.off('goto-preprocessor');
  });
};