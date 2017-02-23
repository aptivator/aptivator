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

var _fragment = require('../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _route = require('../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

var _duplicatesRemover = require('./lib/duplicates-remover');

var _duplicatesRemover2 = _interopRequireDefault(_duplicatesRemover);

var _transientInitializer = require('./lib/transient-initializer');

var _transientInitializer2 = _interopRequireDefault(_transientInitializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

var eventHandle = 'aptivator-goto-preprocessor';

exports.default = function (stateParams) {
  (0, _canceler2.default)(stateParams);

  return new Promise(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
      var transient, startingStates, query, startedStates, transientStates;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              transient = stateParams.flags.transient;


              _lodash2.default.extend(stateParams.flags, { initialized: true });

              if (!transient) {
                _context.next = 4;
                break;
              }

              return _context.abrupt('return', resolve(stateParams));

            case 4:

              _instance2.default.once(eventHandle, function () {
                return resolve(stateParams);
              });

              startingStates = _instance2.default.history.find({ flags: { initialized: false } });

              if (!startingStates.length) {
                _context.next = 8;
                break;
              }

              return _context.abrupt('return');

            case 8:
              query = { flags: { pending: true, initialized: true, preprocessed: false, canceled: false } };
              startedStates = _instance2.default.history.find(query);
              _context.next = 12;
              return (0, _duplicatesRemover2.default)(startedStates);

            case 12:
              startedStates = _context.sent;
              transientStates = _instance2.default.history.find(function (stateParams) {
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

              _instance2.default.trigger(eventHandle);

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};