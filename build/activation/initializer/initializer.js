'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(stateParams) {
    var ignorePending, routeParams, routeValues, silent, stateName, stateConfigs, transient, isTransient, transientStateName;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ignorePending = stateParams.ignorePending, routeParams = stateParams.routeParams, routeValues = stateParams.routeValues, silent = stateParams.silent, stateName = stateParams.stateName;
            stateConfigs = registry[stateName];


            if (!stateConfigs) {
              _error2.default.throw('invalid [' + stateName + '] state name', 'initializer');
            }

            delete stateParams.noResolves;

            transient = stateConfigs.transient;
            isTransient = !!transient;


            if (_vars2.default.configs.showRuntime && !transient) {
              stateParams.time = _lodash2.default.now();
            }

            if (!ignorePending) {
              pending.forEach(function (stateParams) {
                var stateName = stateParams.stateName;

                stateParams.abort = true;
                _instance2.default.deactivate({ name: stateName });
              });

              if (states.activeTransient) {
                _instance2.default.deactivate({ name: states.activeTransient });
              }
            }

            if (!transient) {
              transientStateName = _approximator2.default.fromStateName('transient', stateName);

              if (transientStateName) {
                stateParams.transient = (0, _transientInitializer2.default)(transientStateName);
              }
            }

            if (_lodash2.default.isObject(transient)) {
              _lodash2.default.extend(stateParams, _lodash2.default.pick(transient, ['noResolves']));
            }

            if (stateConfigs.route && !routeParams) {
              if (!routeValues) {
                routeValues = stateConfigs.routeValues;
              }

              routeParams = _route2.default.parts.assemble(stateName, routeValues);

              if (!silent) {
                _fragment2.default.set(routeParams.fragment);
              }
            }

            _lodash2.default.extend(stateParams, { isTransient: isTransient, routeParams: routeParams });

            pending.add(stateParams);

            return _context.abrupt('return', stateParams);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();