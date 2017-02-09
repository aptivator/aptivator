'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(e, stateParams) {
    var eventName, errorStateHandle, errorHandle, results;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (e instanceof Error) {
              _context.next = 9;
              break;
            }

            eventName = 'errored';
            errorStateHandle = eventName + ':' + stateParams.stateName + ':' + e;
            errorHandle = eventName + ':' + e;
            _context.next = 6;
            return _instance2.default.trigger([{ handle: errorStateHandle, full: true }, errorHandle], e, stateParams);

          case 6:
            results = _context.sent;


            _lodash2.default.extend(stateParams.hooks, results);
            _lodash2.default.extend(stateParams.flags, (0, _defineProperty3.default)({}, e, true));

          case 9:

            console.error(e);
            throw e;

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();