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

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _fragment = require('../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _historyAdder = require('../../history/history-adder');

var _historyAdder2 = _interopRequireDefault(_historyAdder);

var _route = require('../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _defaultFlags = require('./lib/default-flags');

var _defaultFlags2 = _interopRequireDefault(_defaultFlags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(stateParams) {
    var stateName, _stateParams$name, name, _stateParams$flags, flags, route, direct, routeValues, _flags, silent, parallel, stateConfigs;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            stateName = stateParams.stateName, _stateParams$name = stateParams.name, name = _stateParams$name === undefined ? stateName : _stateParams$name, _stateParams$flags = stateParams.flags, flags = _stateParams$flags === undefined ? {} : _stateParams$flags, route = stateParams.route, direct = stateParams.direct, routeValues = stateParams.routeValues;
            _flags = flags, silent = _flags.silent, parallel = _flags.parallel;
            stateConfigs = registry[name];

            if (stateConfigs) {
              _context.next = 5;
              break;
            }

            throw { errorType: 'undeclared', errorMessage: 'state [' + name + '] does not exist' };

          case 5:

            if (_lodash2.default.isEmpty(flags)) {
              flags = stateParams.flags = {};
            }

            _lodash2.default.extend(stateParams.flags, _defaultFlags2.default, _lodash2.default.clone(flags));

            if (!stateName) {
              stateParams.stateName = name;
              delete stateParams.name;
            }

            if (stateConfigs.route && !route) {
              if (!routeValues) {
                routeValues = stateConfigs.routeValues;
              }

              route = _route2.default.parts.assemble(name, routeValues);

              if (!(silent || parallel)) {
                _fragment2.default.set(route.fragment);
              }

              _lodash2.default.extend(stateParams, { route: route });
            }

            _lodash2.default.each(stateConfigs.states, function (parallelStateParams) {
              parallelStateParams = _lodash2.default.cloneDeep(parallelStateParams);
              var _parallelStateParams = parallelStateParams,
                  parallelDirect = _parallelStateParams.direct,
                  parallelRoute = _parallelStateParams.route;


              if (direct && parallelDirect) {
                parallelStateParams.direct = direct;
              }

              if (route && parallelRoute) {
                parallelStateParams.route = route;
              }

              if (flags.transient) {
                parallelStateParams.flags.transient = true;
              }

              _instance2.default.activate(parallelStateParams);
            });

            (0, _historyAdder2.default)(stateParams);

            return _context.abrupt('return', stateParams);

          case 12:
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