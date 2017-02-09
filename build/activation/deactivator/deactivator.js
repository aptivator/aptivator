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

var _serialStateDeactivator = require('./serial-state-deactivator/serial-state-deactivator');

var _serialStateDeactivator2 = _interopRequireDefault(_serialStateDeactivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventHandle = 'aptivator-goto-render-';

var eventHandles = ['transient', 'regular'].reduce(function (o, suffix) {
  o[suffix] = '' + eventHandle + suffix;
  return o;
}, {});

var triggerer = function triggerer(suffix) {
  var handle = eventHandles[suffix];
  _instance2.default.trigger(handle);
  _instance2.default.off(handle);
};

exports.default = function (stateParams) {
  return new Promise(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
      var transient, _query, loadingTransients, serialTransients, query, loadingRegulars, loadedRegulars, transientStates, transientPromises, serialRegular;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              stateParams.flags.prerendered = true;

              transient = stateParams.flags.transient;

              if (!transient) {
                _context.next = 13;
                break;
              }

              _instance2.default.on(eventHandles['transient'], function () {
                return resolve(stateParams);
              });

              _query = { flags: { pending: true, transient: true, loading: false, canceled: false } };
              loadingTransients = _instance2.default.history.find(_query);

              if (!loadingTransients.length) {
                _context.next = 8;
                break;
              }

              return _context.abrupt('return');

            case 8:

              _query = { flags: { transient: true, pending: true, loading: true, canceled: false, parallel: false } };
              serialTransients = _instance2.default.history.findOne(_query);


              if (serialTransients) {
                (0, _serialStateDeactivator2.default)();
              }

              triggerer('transient');

              return _context.abrupt('return');

            case 13:

              _instance2.default.on(eventHandles['regular'], function () {
                return resolve(stateParams);
              });

              query = { flags: { pending: true, transient: false, prerendered: false, canceled: false } };
              loadingRegulars = _instance2.default.history.find(query);

              if (!loadingRegulars.length) {
                _context.next = 18;
                break;
              }

              return _context.abrupt('return');

            case 18:

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
                  clearTimeout(timeout);
                }

                return promises;
              }, []);
              _context.next = 24;
              return Promise.all(transientPromises);

            case 24:

              transientStates.forEach(function (stateParams) {
                _instance2.default.deactivate({ name: stateParams.stateName, stateParams: stateParams });
              });

              serialRegular = _lodash2.default.find(loadedRegulars, { flags: { parallel: false } });


              if (!transientPromises.hasSerial && serialRegular) {
                (0, _serialStateDeactivator2.default)();
              }

              triggerer('regular');

            case 28:
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