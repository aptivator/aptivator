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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(stateParams) {
    var transient, keepLast, _ref2, lastStateName, _ref3, promise, transientParams, timeout, deactivate, name;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            transient = stateParams.transient, keepLast = stateParams.keepLast;
            _ref2 = _instance2.default.history.prev() || {}, lastStateName = _ref2.stateName;
            _ref3 = transient || {}, promise = _ref3.promise, transientParams = _ref3.params, timeout = _ref3.timeout;

            deactivate = function deactivate(keepLast) {
              if (!keepLast && lastStateName) {
                _instance2.default.deactivate({ name: lastStateName });
              }
              return stateParams;
            };

            if (!promise) {
              _context.next = 12;
              break;
            }

            _context.next = 7;
            return promise;

          case 7:
            name = transientParams.name;

            keepLast = !transientParams.keepLast;
            _instance2.default.deactivate({ name: name });
            _context.next = 13;
            break;

          case 12:
            clearTimeout(timeout);

          case 13:
            return _context.abrupt('return', deactivate(keepLast));

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