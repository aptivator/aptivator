'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pause = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ms) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new Promise(function (resolve) {
              return setTimeout(resolve, ms);
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

exports.default = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(stateParams) {
    var transient, keepLast, _ref3, lastStateName, _ref4, promise, transientParams, timeout, deactivate, stateName;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            (0, _canceler2.default)(stateParams);

            if (!stateParams.abort) {
              _context2.next = 3;
              break;
            }

            throw 'abort';

          case 3:
            transient = stateParams.transient, keepLast = stateParams.keepLast;
            _ref3 = _instance2.default.history.prev() || {}, lastStateName = _ref3.stateName;
            _ref4 = transient || {}, promise = _ref4.promise, transientParams = _ref4.params, timeout = _ref4.timeout;

            deactivate = function deactivate(keepLast) {
              if (!keepLast && lastStateName) {
                _instance2.default.deactivate({ name: lastStateName });
              }
            };

            if (!promise) {
              _context2.next = 15;
              break;
            }

            _context2.next = 10;
            return promise;

          case 10:
            stateName = transientParams.stateName;

            keepLast = !transientParams.keepLast;
            _instance2.default.deactivate({ name: stateName });
            _context2.next = 16;
            break;

          case 15:
            if (timeout) {
              clearTimeout(timeout);
            }

          case 16:
            deactivate(keepLast);
            _context2.next = 19;
            return pause(20);

          case 19:
            return _context2.abrupt('return', stateParams);

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();