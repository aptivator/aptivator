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

var _aptivator = require('../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _fragment = require('../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _routeAssembler = require('../../lib/route/route-assembler');

var _routeAssembler2 = _interopRequireDefault(_routeAssembler);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _historyAdder = require('../../history/history-adder');

var _historyAdder2 = _interopRequireDefault(_historyAdder);

var _defaultFlags = require('./lib/default-flags');

var _defaultFlags2 = _interopRequireDefault(_defaultFlags);

var _parallelStatesStarter = require('./lib/parallel-states-starter');

var _parallelStatesStarter2 = _interopRequireDefault(_parallelStatesStarter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activating = _vars2.default.activating,
    states = _vars2.default.states;
var registry = states.registry;

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(stateParams) {
    var stateName, _stateParams$name, name, _stateParams$flags, flags, route, routeValues, _flags, silent, parallel, transient, stateConfigs, tracker, query, activeStatesParams, routeConfigs, values;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            stateName = stateParams.stateName, _stateParams$name = stateParams.name, name = _stateParams$name === undefined ? stateName : _stateParams$name, _stateParams$flags = stateParams.flags, flags = _stateParams$flags === undefined ? {} : _stateParams$flags, route = stateParams.route, routeValues = stateParams.routeValues;
            _flags = flags, silent = _flags.silent, parallel = _flags.parallel, transient = _flags.transient;
            stateConfigs = registry[name];
            tracker = activating[transient ? 'transient' : 'regular'];

            if (stateConfigs) {
              _context.next = 6;
              break;
            }

            throw { type: 'undeclared', message: 'state [' + name + '] does not exist' };

          case 6:
            query = { stateName: name, flags: { active: true } };
            activeStatesParams = _aptivator2.default.history.find(query);


            _lodash2.default.each(activeStatesParams, function (stateParams) {
              _lodash2.default.extend(stateParams.flags, { active: false });
            });

            if (!((parallel || transient) && tracker.includes(name))) {
              _context.next = 11;
              break;
            }

            return _context.abrupt('return');

          case 11:

            tracker.push(name);

            if (_lodash2.default.isEmpty(flags)) {
              flags = stateParams.flags = {};
            }

            _lodash2.default.extend(stateParams.flags, _defaultFlags2.default, _lodash2.default.clone(flags));

            if (!stateName) {
              stateParams.stateName = name;
              delete stateParams.name;
            }

            routeConfigs = stateConfigs.route;


            if (!_lodash2.default.isEmpty(routeConfigs) && !route) {
              values = routeConfigs.values;


              if (!routeValues) {
                routeValues = values;
              }

              route = (0, _routeAssembler2.default)(name, routeValues);

              if (!(silent || parallel)) {
                _fragment2.default.set(route.fragment);
              }

              _lodash2.default.extend(stateParams, { route: route });
            }

            (0, _parallelStatesStarter2.default)(stateParams);

            (0, _historyAdder2.default)(stateParams);

            return _context.abrupt('return', stateParams);

          case 20:
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