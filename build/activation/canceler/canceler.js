'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(stateParams) {
    var _stateParams$flags, undeclared, duplicateSerial, canceled;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _stateParams$flags = stateParams.flags, undeclared = _stateParams$flags.undeclared, duplicateSerial = _stateParams$flags.duplicateSerial, canceled = _stateParams$flags.canceled;

            if (!undeclared) {
              _context.next = 3;
              break;
            }

            throw 'undeclared';

          case 3:
            if (!duplicateSerial) {
              _context.next = 5;
              break;
            }

            throw 'duplicate-serial';

          case 5:
            if (!canceled) {
              _context.next = 7;
              break;
            }

            throw 'canceled';

          case 7:
            return _context.abrupt('return', stateParams);

          case 8:
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