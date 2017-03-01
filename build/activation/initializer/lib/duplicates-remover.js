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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(startedStates) {
    var serialStates, serialStatesDuplicates, query, pendingSerialState, deactivationPromises, taggedStateNames;
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
            deactivationPromises = [];
            taggedStateNames = [];


            !function canceler() {
              var stateParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pendingSerialState;

              if (!stateParams) {
                return;
              }

              var stateName = stateParams.stateName;


              if (taggedStateNames.includes(stateName)) {
                return;
              }

              taggedStateNames.push(stateName);

              var flags = stateParams.flags,
                  transientStateParams = stateParams.transientStateParams,
                  parallels = stateParams.parallels;

              var _ref2 = transientStateParams || {},
                  owners = _ref2.owners;

              if (owners) {
                owners.delete(stateParams);
              }

              _lodash2.default.extend(flags, { canceled: true });

              console.log('clearing ' + stateName);

              if (flags.rendered) {
                _lodash2.default.extend(flags, { active: true });
                var promise = _instance2.default.deactivate({ name: stateName }).catch(_lodash2.default.noop);
                deactivationPromises.push(promise);
              }

              if (owners && !owners.size) {
                canceler(transientStateParams);
              }

              _lodash2.default.each(parallels, function (stateParams) {
                return canceler(stateParams);
              });
            }();

            _context.next = 15;
            return Promise.all(deactivationPromises);

          case 15:
            return _context.abrupt('return', startedStates);

          case 16:
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