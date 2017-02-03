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

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _canceler = require('../canceler/canceler');

var _canceler2 = _interopRequireDefault(_canceler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var totalTransientConfigs = [];

exports.default = function (stateParams) {
  return new Promise(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
      var _stateParams$flags, transient, parallel, activeStateParams, pendingTransients, transientConfigs, pendingRegulars;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              (0, _canceler2.default)(stateParams);

              _stateParams$flags = stateParams.flags, transient = _stateParams$flags.transient, parallel = _stateParams$flags.parallel;
              activeStateParams = _instance2.default.history.getOne(function (stateParams) {
                var _stateParams$flags2 = stateParams.flags,
                    active = _stateParams$flags2.active,
                    parallel = _stateParams$flags2.parallel,
                    transient = _stateParams$flags2.transient;

                if (active && !parallel && !transient) {
                  return true;
                }
              });

              if (!transient) {
                _context2.next = 8;
                break;
              }

              _instance2.default.on('transient-render', function () {
                var _ref2 = activeStateParams || {},
                    stateName = _ref2.stateName,
                    flags = _ref2.flags;

                var _ref3 = flags || {},
                    active = _ref3.active;

                if (!parallel && active) {
                  _instance2.default.deactivate({ name: stateName, stateParams: activeStateParams });
                }

                resolve(stateParams);
              });

              pendingTransients = _instance2.default.history.get(function (stateParams) {
                var _stateParams$flags3 = stateParams.flags,
                    pending = _stateParams$flags3.pending,
                    canceled = _stateParams$flags3.canceled,
                    transient = _stateParams$flags3.transient,
                    loading = _stateParams$flags3.loading;

                if (transient && pending && !loading && !canceled) {
                  return true;
                }
              });


              if (!pendingTransients.length) {
                _instance2.default.trigger('transient-render');
                _instance2.default.off('transient-render');
              }

              return _context2.abrupt('return');

            case 8:
              transientConfigs = stateParams.transientConfigs;
              pendingRegulars = _instance2.default.history.get(function (stateParams) {
                var _stateParams$flags4 = stateParams.flags,
                    pending = _stateParams$flags4.pending,
                    canceled = _stateParams$flags4.canceled,
                    transient = _stateParams$flags4.transient,
                    loading = _stateParams$flags4.loading;

                if (pending && !transient && !loading && !canceled) {
                  return true;
                }
              });


              if (transientConfigs && !totalTransientConfigs.includes(transientConfigs)) {
                totalTransientConfigs.push(transientConfigs);
              }

              _instance2.default.on('regular-render', function () {
                var _ref4 = activeStateParams || {},
                    stateName = _ref4.stateName,
                    flags = _ref4.flags;

                var _ref5 = flags || {},
                    active = _ref5.active;

                if (!parallel && active) {
                  _instance2.default.deactivate({ name: stateName, stateParams: activeStateParams });
                }

                resolve(stateParams);
              });

              if (pendingRegulars.length) {
                _context2.next = 14;
                break;
              }

              return _context2.delegateYield(_regenerator2.default.mark(function _callee() {
                var promisesMap, promises, transientStateNames;
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        promisesMap = totalTransientConfigs.reduce(function (promisesMap, transientConfigs) {
                          var promise = transientConfigs.promise,
                              params = transientConfigs.params,
                              timeout = transientConfigs.timeout;

                          if (!promise) {
                            clearTimeout(timeout);
                          } else {
                            promisesMap[params.stateName] = { promise: promise, stateParams: params };
                          }

                          return promisesMap;
                        }, {});
                        promises = _lodash2.default.map(promisesMap, function (valuesObj) {
                          return valuesObj.promise;
                        });
                        transientStateNames = _lodash2.default.keys(promisesMap);
                        _context.next = 5;
                        return Promise.all(promises);

                      case 5:
                        transientStateNames.forEach(function (stateName) {
                          return _instance2.default.deactivate({ name: stateName, stateParams: promisesMap[stateName].stateParams });
                        });
                        _instance2.default.trigger('regular-render');
                        _instance2.default.off('regular-render');
                        totalTransientConfigs = [];

                      case 9:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              })(), 't0', 14);

            case 14:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};