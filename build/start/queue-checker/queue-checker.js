'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _missingParentsAssembler = require('./lib/missing-parents-assembler');

var _missingParentsAssembler2 = _interopRequireDefault(_missingParentsAssembler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queue = _vars2.default.states.queue;
exports.default = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (queue.length) {
            _error2.default.throw('undeclared parent states: [' + (0, _missingParentsAssembler2.default)(queue) + ']', 'starter');
          }

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));