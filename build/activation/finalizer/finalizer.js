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

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(stateParams) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _canceler2.default)(stateParams);

            _lodash2.default.extend(stateParams.flags, { pending: false, active: true });

            console.log('finished ' + stateParams.stateName);

            if (stateParams.time) {
              console.log('%cruntime: ' + (_lodash2.default.now() - stateParams.time) + 'ms', 'color: green;');
            }

            delete stateParams.time;

            return _context.abrupt('return', stateParams);

          case 6:
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