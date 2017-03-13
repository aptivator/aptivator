'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _aptivator = require('../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _error = require('../lib/error');

var _error2 = _interopRequireDefault(_error);

var _hookResulter = require('../lib/hook-resulter');

var _hookResulter2 = _interopRequireDefault(_hookResulter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(e) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(e instanceof Error)) {
              (function () {
                var type = e.type,
                    message = e.message,
                    _e$stateParams = e.stateParams,
                    stateParams = _e$stateParams === undefined ? {} : _e$stateParams;
                var stateName = stateParams.stateName;

                var eventName = 'error';
                var errorHandles = [eventName + ':' + type];
                var errorToPrint = _error2.default.message('' + type + (message ? ': ' + message : ''), 'errorer');

                if (stateName) {
                  var handle = eventName + ':' + stateName + ':' + type;
                  errorHandles.push({ handle: handle, full: true });
                }

                _aptivator2.default.trigger(errorHandles, type, stateParams).then(function (results) {
                  if (stateName) {
                    (0, _hookResulter2.default)(type, stateParams, results);
                  }
                });

                console.log('%c' + errorToPrint, 'color: red');
              })();
            } else {
              console.error(e);
            }

            throw e;

          case 2:
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