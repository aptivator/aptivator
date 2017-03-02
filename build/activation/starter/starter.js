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

var _route = require('../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _historyAdder = require('../../history/history-adder');

var _historyAdder2 = _interopRequireDefault(_historyAdder);

var _defaultFlags = require('./lib/default-flags');

var _defaultFlags2 = _interopRequireDefault(_defaultFlags);

var _parallelStatesStarter = require('./lib/parallel-states-starter');

var _parallelStatesStarter2 = _interopRequireDefault(_parallelStatesStarter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(stateParams) {
    var stateName, _stateParams$name, name, _stateParams$flags, flags, route, routeValues, _flags, silent, parallel, transient, spliced, stateConfigs, duplicateStateParams, transientConfigs;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            stateName = stateParams.stateName, _stateParams$name = stateParams.name, name = _stateParams$name === undefined ? stateName : _stateParams$name, _stateParams$flags = stateParams.flags, flags = _stateParams$flags === undefined ? {} : _stateParams$flags, route = stateParams.route, routeValues = stateParams.routeValues;
            _flags = flags, silent = _flags.silent, parallel = _flags.parallel, transient = _flags.transient, spliced = _flags.spliced;
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

            if (!(parallel || transient)) {
              _context.next = 14;
              break;
            }

            duplicateStateParams = _aptivator2.default.history.findOne(function (stateParams) {
              var stateName = stateParams.stateName,
                  flags = stateParams.flags;
              var pending = flags.pending,
                  active = flags.active,
                  canceled = flags.canceled,
                  duplicateTransient = flags.transient;

              var conditions = new Set();

              conditions.add(name === stateName);
              conditions.add(spliced && active || pending);
              conditions.add(!canceled);
              conditions.add(duplicateTransient === transient);

              return conditions.size === 1;
            });

            if (!duplicateStateParams) {
              _context.next = 14;
              break;
            }

            transientConfigs = duplicateStateParams.transientConfigs;

            if (!(transientConfigs || parallel)) {
              _context.next = 13;
              break;
            }

            return _context.abrupt('return');

          case 13:
            duplicateStateParams.flags.canceled = true;

          case 14:

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

            (0, _parallelStatesStarter2.default)(stateParams);

            (0, _historyAdder2.default)(stateParams);

            return _context.abrupt('return', stateParams);

          case 19:
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