'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

var _serialStateDeactivator = require('./serial-state-deactivator/serial-state-deactivator');

var _serialStateDeactivator2 = _interopRequireDefault(_serialStateDeactivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventHandles = _lodash2.default.mapValues({ transient: '', regular: '' }, function (value, key) {
  return 'aptivator-goto-render-' + key;
});

exports.default = function (stateParams) {
  (0, _canceler2.default)(stateParams);

  return new Promise(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
      var transient, _eventHandle, _query, loadingTransients, serialTransients, eventHandle, query, loadingRegulars, loadedRegulars, transientStates, transientPromises, deactivationPromises, serialRegular, promise;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              stateParams.flags.prerendered = true;

              transient = stateParams.flags.transient;

              if (!transient) {
                _context.next = 15;
                break;
              }

              _eventHandle = eventHandles.transient;


              _instance2.default.once(_eventHandle, function () {
                return resolve(stateParams);
              });

              _query = { flags: { pending: true, transient: true, loading: false, canceled: false, prerendered: false } };
              loadingTransients = _instance2.default.history.find(_query);

              if (!loadingTransients.length) {
                _context.next = 9;
                break;
              }

              return _context.abrupt('return');

            case 9:

              _query = { flags: { transient: true, pending: true, loading: true, canceled: false, parallel: false } };
              serialTransients = _instance2.default.history.findOne(_query);

              if (!serialTransients) {
                _context.next = 14;
                break;
              }

              _context.next = 14;
              return (0, _serialStateDeactivator2.default)();

            case 14:
              return _context.abrupt('return', _instance2.default.trigger(_eventHandle));

            case 15:
              eventHandle = eventHandles.regular;


              _instance2.default.once(eventHandle, function () {
                return resolve(stateParams);
              });

              query = { flags: { pending: true, transient: false, prerendered: false, canceled: false } };
              loadingRegulars = _instance2.default.history.find(query);

              if (!loadingRegulars.length) {
                _context.next = 21;
                break;
              }

              return _context.abrupt('return');

            case 21:

              query = { flags: { pending: true, transient: false, canceled: false, loading: true } };
              loadedRegulars = _instance2.default.history.find(query);
              transientStates = loadedRegulars.reduce(function (transientStates, stateParams) {
                return transientStates.add(stateParams.transientStateParams);
              }, new Set());
              transientPromises = [].concat((0, _toConsumableArray3.default)(transientStates)).reduce(function (promises, stateParams) {
                var _ref2 = stateParams.transientConfigs || {},
                    promise = _ref2.promise,
                    timeout = _ref2.timeout;

                if (!stateParams.flags.parallel && promise) {
                  promises.hasSerial = true;
                }

                if (promise) {
                  promises.push(promise);
                } else {
                  transientStates.delete(stateParams);
                  clearTimeout(timeout);
                }

                return promises;
              }, []);
              _context.next = 27;
              return Promise.all(transientPromises);

            case 27:
              deactivationPromises = [];


              transientStates.forEach(function (stateParams) {
                var promise = _instance2.default.deactivate({ name: stateParams.stateName });
                deactivationPromises.push(promise);
              });

              serialRegular = _lodash2.default.find(loadedRegulars, { flags: { parallel: false } });


              if (!transientPromises.hasSerial && serialRegular) {
                promise = (0, _serialStateDeactivator2.default)();

                deactivationPromises.push(promise);
              }

              _context.next = 33;
              return Promise.all(deactivationPromises);

            case 33:

              _instance2.default.trigger(eventHandle);

            case 34:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};