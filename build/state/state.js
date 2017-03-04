'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _aptivator = require('../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _error = require('../lib/error');

var _error2 = _interopRequireDefault(_error);

var _relations = require('../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _otherStateRegistrar = require('./lib/other-state-registrar');

var _otherStateRegistrar2 = _interopRequireDefault(_otherStateRegistrar);

var _parallelStatesNormalizer = require('./lib/parallel-states-normalizer');

var _parallelStatesNormalizer2 = _interopRequireDefault(_parallelStatesNormalizer);

var _rootStateConfigurator = require('./lib/root-state-configurator');

var _rootStateConfigurator2 = _interopRequireDefault(_rootStateConfigurator);

var _routeConfigurator = require('./route-configurator/route-configurator');

var _routeConfigurator2 = _interopRequireDefault(_routeConfigurator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var states = _vars2.default.states;
var registry = states.registry,
    queue = states.queue;


_aptivator2.default.state = function (stateName, stateConfigs) {
  return !(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var transient, error, on, once, parallelStates, substates, route, root, parentStateName, parentConfigs, eventMethods;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (registry[stateName]) {
              _error2.default.throw('state [' + stateName + '] has already been declared', 'state declaration');
            }

            _lodash2.default.extend(stateConfigs, { stateName: stateName });

            if (_relations2.default.isRoot(stateName)) {
              (0, _rootStateConfigurator2.default)(stateConfigs);
            }

            transient = stateConfigs.transient, error = stateConfigs.error, on = stateConfigs.on, once = stateConfigs.once, parallelStates = stateConfigs.states, substates = stateConfigs.substates, route = stateConfigs.route, root = stateConfigs.root;
            parentStateName = root || _relations2.default.parent(stateName);
            parentConfigs = root ? {} : registry[parentStateName];
            eventMethods = {};

            if (parentConfigs) {
              _context.next = 9;
              break;
            }

            return _context.abrupt('return', queue.push([stateName, stateConfigs]));

          case 9:

            if (transient || error) {
              (0, _otherStateRegistrar2.default)(stateName, states[transient ? 'transient' : 'error']);
              delete stateConfigs.route;
            }

            if (on) {
              _lodash2.default.extend(eventMethods, { on: on });
            }

            if (once) {
              _lodash2.default.extend(eventMethods, { once: once });
            }

            _lodash2.default.each(eventMethods, function (eventsConfigs, eventMethod) {
              _aptivator2.default[eventMethod](_lodash2.default.mapValues(eventsConfigs, function (eventConfigs) {
                return (0, _defineProperty3.default)({}, stateName, eventConfigs);
              }));
            });

            if (parallelStates) {
              (0, _parallelStatesNormalizer2.default)(parallelStates, stateName);
            }

            if (route) {
              (0, _routeConfigurator2.default)(stateConfigs, parentConfigs);
            }

            registry[stateName] = stateConfigs;

            _lodash2.default.each(substates, function (stateConfigs, subStateName) {
              _aptivator2.default.state(stateName + '.' + subStateName, stateConfigs);
            });

            if (queue.length) {
              _aptivator2.default.state.apply(_aptivator2.default, (0, _toConsumableArray3.default)(queue.pop()));
            }

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }))().catch(_error2.default.errorer);
};