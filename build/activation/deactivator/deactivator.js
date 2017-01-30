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
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(stateParams) {
    var transient, keepLast, lastStateParams, lastStateName, _ref3, promise, transientParams, timeout, deactivate, triggerPromise, stateName, handle;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            (0, _canceler2.default)(stateParams);

            transient = stateParams.transient, keepLast = stateParams.keepLast;
            lastStateParams = _instance2.default.history.prev() || {};
            lastStateName = lastStateParams.stateName;
            _ref3 = transient || {}, promise = _ref3.promise, transientParams = _ref3.params, timeout = _ref3.timeout;

            deactivate = function () {
              var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(keepLast) {
                var handle;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!(!keepLast && lastStateName)) {
                          _context2.next = 4;
                          break;
                        }

                        handle = 'exit:' + lastStateName;

                        _instance2.default.deactivate({ name: lastStateName });
                        return _context2.abrupt('return', _instance2.default.trigger(handle, lastStateParams));

                      case 4:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined);
              }));

              return function deactivate(_x3) {
                return _ref4.apply(this, arguments);
              };
            }();

            triggerPromise = deactivate(keepLast);

            if (!promise) {
              _context3.next = 17;
              break;
            }

            _context3.next = 10;
            return promise;

          case 10:
            stateName = transientParams.stateName;
            handle = 'exit:' + stateName;

            keepLast = !transientParams.keepLast;
            _instance2.default.deactivate({ name: stateName });
            _instance2.default.trigger(handle);
            _context3.next = 18;
            break;

          case 17:
            if (timeout) {
              clearTimeout(timeout);
            }

          case 18:
            _context3.next = 20;
            return triggerPromise;

          case 20:
            return _context3.abrupt('return', stateParams);

          case 21:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();