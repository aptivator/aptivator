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

var _duplicatesRemover = require('./duplicates-remover/duplicates-remover');

var _duplicatesRemover2 = _interopRequireDefault(_duplicatesRemover);

var _transientInitializer = require('./transient-initializer/transient-initializer');

var _transientInitializer2 = _interopRequireDefault(_transientInitializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

var eventHandle = 'aptivator-goto-preprocessor';

exports.default = function (stateParams) {
  return new Promise(function (resolve) {
    var transient = stateParams.flags.transient;


    _lodash2.default.extend(stateParams.flags, { initialized: true });

    _instance2.default.on(eventHandle, function () {
      return resolve(stateParams);
    });

    var startingStates = _instance2.default.history.find({ flags: { initialized: false } });

    if (startingStates.length) {
      return;
    }

    var triggerer = function triggerer() {
      _instance2.default.trigger(eventHandle);
      _instance2.default.off(eventHandle);
    };

    var query = { flags: { pending: true, initialized: true, preprocessed: false, canceled: false } };
    var startedStates = _instance2.default.history.find(query);
    var undeclaredStates = startedStates.filter(function (stateParams) {
      var flags = stateParams.flags,
          stateName = stateParams.stateName;

      if (!registry[stateName]) {
        return _lodash2.default.extend(flags, { canceled: true, pending: false, undeclared: true });
      }
    });

    if (transient) {
      return triggerer();
    }

    startedStates = _lodash2.default.difference(startedStates, undeclaredStates);
    startedStates = (0, _duplicatesRemover2.default)(startedStates);

    var transientStates = _instance2.default.history.find(function (stateParams) {
      var _stateParams$flags = stateParams.flags,
          active = _stateParams$flags.active,
          pending = _stateParams$flags.pending,
          canceled = _stateParams$flags.canceled,
          transient = _stateParams$flags.transient;

      if (transient && (active || pending) && !canceled) {
        return true;
      }
    });

    transientStates = transientStates.reduce(function (o, stateParams) {
      o[stateParams.stateName] = stateParams;
      return o;
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

    triggerer();
  });
};