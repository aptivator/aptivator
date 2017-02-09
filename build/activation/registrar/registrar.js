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

var _historyAdder = require('../../history/history-adder');

var _historyAdder2 = _interopRequireDefault(_historyAdder);

var _defaultFlags = require('./lib/default-flags');

var _defaultFlags2 = _interopRequireDefault(_defaultFlags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(stateParams) {
    var flags;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            flags = stateParams.flags;


            if (!flags) {
              flags = stateParams.flags = {};
            }

            _lodash2.default.extend(stateParams.flags, _defaultFlags2.default, _lodash2.default.clone(flags));

            if (stateParams.name) {
              stateParams.stateName = stateParams.name;
              delete stateParams.name;
            }

            stateParams.hooks = {};
            (0, _historyAdder2.default)(stateParams);

            return _context.abrupt('return', stateParams);

          case 7:
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