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

var _approximator = require('../../lib/approximator');

var _approximator2 = _interopRequireDefault(_approximator);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _duplicatesRemover = require('./lib/duplicates-remover');

var _duplicatesRemover2 = _interopRequireDefault(_duplicatesRemover);

var _transientInitializer = require('./lib/transient-initializer');

var _transientInitializer2 = _interopRequireDefault(_transientInitializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activating = _vars2.default.activating;


var eventHandles = _lodash2.default.mapValues({ transient: '', regular: '' }, function (value, key) {
  return 'aptivator-goto-preprocessor-' + key;
});

exports.default = function (stateParams) {
  return new Promise(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve) {
      var transient, _eventHandle, _query, startingTransients, eventHandle, startingStates, query, startedStates, transientStates;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              transient = stateParams.flags.transient;


              _lodash2.default.extend(stateParams.flags, { initialized: true });

              if (!transient) {
                _context.next = 11;
                break;
              }

              _eventHandle = eventHandles.transient;


              _instance2.default.once(_eventHandle, function () {
                return resolve(stateParams);
              });

              _query = { flags: { transient: true, initialized: false } };
              startingTransients = _instance2.default.history.find(_query);

              if (!startingTransients.length) {
                _context.next = 9;
                break;
              }

              return _context.abrupt('return');

            case 9:

              _lodash2.default.remove(activating.transient, function () {
                return true;
              });
              return _context.abrupt('return', _instance2.default.trigger(_eventHandle));

            case 11:
              eventHandle = eventHandles.regular;


              _instance2.default.once(eventHandle, function () {
                return resolve(stateParams);
              });

              startingStates = _instance2.default.history.find({ flags: { initialized: false, transient: false } });

              if (!startingStates.length) {
                _context.next = 16;
                break;
              }

              return _context.abrupt('return');

            case 16:
              query = { flags: { pending: true, initialized: true, preprocessed: false, canceled: false } };
              startedStates = _instance2.default.history.find(query);
              _context.next = 20;
              return (0, _duplicatesRemover2.default)(startedStates);

            case 20:
              startedStates = _context.sent;


              _lodash2.default.remove(activating.regular, function () {
                return true;
              });

              transientStates = _instance2.default.history.find(function (stateParams) {
                var _stateParams$flags = stateParams.flags,
                    active = _stateParams$flags.active,
                    pending = _stateParams$flags.pending,
                    canceled = _stateParams$flags.canceled,
                    transient = _stateParams$flags.transient;

                if (transient && (active || pending) && !canceled) {
                  return true;
                }
              });


              transientStates = transientStates.reduce(function (o, stateParams) {
                o[stateParams.stateName] = stateParams;
                return o;
              }, {});

              _lodash2.default.each(startedStates, function (stateParams) {
                var transientStateName = _approximator2.default.fromStateName('transient', stateParams.stateName);

                if (transientStateName) {
                  var transientStateParams = transientStates[transientStateName];
                  if (!transientStateParams) {
                    transientStateParams = (0, _transientInitializer2.default)(transientStateName);
                    transientStates[transientStateName] = transientStateParams;
                  }

                  if (!transientStateParams.owners) {
                    transientStateParams.owners = new Set();
                  }

                  transientStateParams.owners.add(stateParams);
                  _lodash2.default.extend(stateParams, { transientStateParams: transientStateParams });
                }
              });

              if (_vars2.default.configs.showRuntime) {
                stateParams.time = _lodash2.default.now();
              }

              _instance2.default.trigger(eventHandle);

            case 27:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};