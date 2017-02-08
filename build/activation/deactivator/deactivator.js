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

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

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
      var transient, loadingTransients, serialTransients, loadingRegulars, loadedRegulars, transientStates, transientPromises;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              (0, _canceler2.default)(stateParams);
              _context.next = 7;
              break;

            case 4:
              _context.prev = 4;
              _context.t0 = _context['catch'](0);
              return _context.abrupt('return', reject(_context.t0));

            case 7:

              stateParams.flags.prerendered = true;

              transient = stateParams.flags.transient;

              if (!transient) {
                _context.next = 18;
                break;
              }

              _instance2.default.on(eventHandles['transient'], function () {
                return resolve(stateParams);
              });

              loadingTransients = _instance2.default.history.get(function (stateParams) {
                var _stateParams$flags = stateParams.flags,
                    pending = _stateParams$flags.pending,
                    canceled = _stateParams$flags.canceled,
                    transient = _stateParams$flags.transient,
                    loading = _stateParams$flags.loading;

                if (transient && pending && !loading && !canceled) {
                  return true;
                }
              });

              if (!loadingTransients.length) {
                _context.next = 14;
                break;
              }

              return _context.abrupt('return');

            case 14:
              serialTransients = _instance2.default.history.getOne(function (stateParams) {
                var _stateParams$flags2 = stateParams.flags,
                    pending = _stateParams$flags2.pending,
                    canceled = _stateParams$flags2.canceled,
                    transient = _stateParams$flags2.transient,
                    loading = _stateParams$flags2.loading,
                    parallel = _stateParams$flags2.parallel;

                if (transient && pending && loading && !canceled && !parallel) {
                  return true;
                }
              });


              if (serialTransients) {
                (0, _serialStateDeactivator2.default)();
              }

              triggerer('transient');

              return _context.abrupt('return');

            case 18:

              _instance2.default.on(eventHandles['regular'], function () {
                return resolve(stateParams);
              });

              loadingRegulars = _instance2.default.history.get(function (stateParams) {
                var _stateParams$flags3 = stateParams.flags,
                    pending = _stateParams$flags3.pending,
                    canceled = _stateParams$flags3.canceled,
                    transient = _stateParams$flags3.transient,
                    prerendered = _stateParams$flags3.prerendered;

                if (pending && !transient && !prerendered && !canceled) {
                  return true;
                }
              });

              if (!loadingRegulars.length) {
                _context.next = 22;
                break;
              }

              return _context.abrupt('return');

            case 22:
              loadedRegulars = _instance2.default.history.get(function (stateParams) {
                var _stateParams$flags4 = stateParams.flags,
                    pending = _stateParams$flags4.pending,
                    canceled = _stateParams$flags4.canceled,
                    transient = _stateParams$flags4.transient,
                    loading = _stateParams$flags4.loading;

                if (pending && !transient && loading && !canceled) {
                  return true;
                }
              });
              transientStates = loadedRegulars.reduce(function (transientStates, stateParams) {
                return transientStates.add(stateParams.transientStateParams);
              }, new Set());
              transientPromises = [].concat((0, _toConsumableArray3.default)(transientStates)).reduce(function (promises, stateParams) {
                var _stateParams$flags5 = stateParams.flags,
                    parallel = _stateParams$flags5.parallel,
                    transient = _stateParams$flags5.transient;

                var _ref2 = transient || {},
                    promise = _ref2.promise,
                    timeout = _ref2.timeout;

                if (!parallel && promise) {
                  promises.hasSerial = true;
                }

                if (promise) {
                  promises.push(promise);
                } else {
                  clearTimeout(timeout);
                }

                return promises;
              }, []);
              _context.next = 27;
              return Promise.all(transientPromises);

            case 27:

              transientStates.forEach(function (stateParams) {
                _instance2.default.deactivate({ name: stateParams.stateName, stateParams: stateParams });
              });

              if (!transientPromises.hasSerial) {
                (0, _serialStateDeactivator2.default)();
              }

              triggerer('regular');

            case 30:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 4]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};