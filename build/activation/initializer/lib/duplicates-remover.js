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

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _canceler = require('./canceler');

var _canceler2 = _interopRequireDefault(_canceler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(startedStates) {
    var serialStates, serialStatesDuplicates, query, pendingSerialState, promises;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            serialStates = _lodash2.default.filter(startedStates, { flags: { parallel: false } });
            serialStatesDuplicates = serialStates.reverse().slice(1);


            if (serialStatesDuplicates.length) {
              _error2.default.warn('included two serial states in an activation', 'initializer');
            }

            serialStates = _lodash2.default.difference(serialStates, serialStatesDuplicates);

            serialStatesDuplicates.forEach(function (stateParams) {
              _lodash2.default.extend(stateParams.flags, { active: false, canceled: true, pending: false, duplicateSerial: true });
            });

            startedStates = _lodash2.default.difference(startedStates, serialStatesDuplicates);

            if (serialStates.length) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', startedStates);

          case 8:
            query = { flags: { parallel: false, pending: true, canceled: false, transient: false, preprocessed: true } };
            pendingSerialState = _instance2.default.history.findOne(query);
            promises = (0, _canceler2.default)(pendingSerialState);
            _context.next = 13;
            return Promise.all(promises);

          case 13:
            return _context.abrupt('return', startedStates);

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