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

var _dataStores = require('./lib/data-stores');

var _dataStores2 = _interopRequireDefault(_dataStores);

var _transientInitializer = require('./lib/transient-initializer');

var _transientInitializer2 = _interopRequireDefault(_transientInitializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pause = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ms) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new Promise(function (resolve) {
              return setTimeout(function () {
                return resolve();
              }, ms);
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function pause(_x) {
    return _ref.apply(this, arguments);
  };
}();

_instance2.default.on('state-change-start', function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', 25);

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function tester() {
    return _ref2.apply(this, arguments);
  }

  return tester;
}());

_instance2.default.on('state-change-start-app-1', function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', 'another');

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  function another() {
    return _ref3.apply(this, arguments);
  }

  return another;
}());

exports.default = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(stateParams) {
    var directParams, routeParams, stateName, routeValues, silent, stateConfigs, transientStateName;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            directParams = stateParams.direct, routeParams = stateParams.route, stateName = stateParams.name, routeValues = stateParams.routeValues, silent = stateParams.silent;
            stateConfigs = _vars2.default.states.registry[stateName];


            delete stateParams.useResolves;

            if (_vars2.default.configs.showRuntime && !stateConfigs.transient) {
              stateParams.time = _lodash2.default.now();
            }

            if (!stateConfigs) {
              _error2.default.throw('invalid [' + stateName + '] state name', 'initializer');
            }

            transientStateName = _approximator2.default.fromStateName('transient', stateName);


            if (transientStateName && transientStateName !== stateName) {
              stateParams.transient = (0, _transientInitializer2.default)(transientStateName);
            }

            if (_lodash2.default.isObject(stateConfigs.transient)) {
              _lodash2.default.extend(stateParams, _lodash2.default.pick(stateConfigs.transient, ['noResolves']));
            }

            if (!routeValues) {
              routeValues = stateConfigs.routeValues;
            }

            if (!stateConfigs.route) {
              silent = true;
            }

            if (!routeParams || _lodash2.default.isEmpty(routeParams)) {
              stateParams.routeParams = _route2.default.parts.assemble(stateName, routeValues);

              if (!silent) {
                _fragment2.default.set(stateParams.routeParams.fragment);
              }
            }

            _lodash2.default.extend(stateParams, _dataStores2.default, { directParams: directParams, routeParams: routeParams, stateName: stateName });

            if (stateConfigs.transient) {
              _context4.next = 17;
              break;
            }

            _context4.next = 15;
            return _instance2.default.trigger('state-change-start');

          case 15:
            _context4.next = 17;
            return _instance2.default.trigger('state-change-start-app-1');

          case 17:
            return _context4.abrupt('return', stateParams);

          case 18:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x2) {
    return _ref4.apply(this, arguments);
  };
}();