'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../lib/error');

var _error2 = _interopRequireDefault(_error);

var _deactivator = require('./deactivator/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.deactivate = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    var name, forward, focal, stateParams, silent;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = params.name, forward = params.forward, focal = params.focal, stateParams = params.stateParams, silent = params.silent;


            if (forward && focal) {
              _error2.default.throw('use either [focal] or [forward] flag', 'deactivator');
            }

            if (name.includes('@')) {
              silent = true;
            }

            if (!silent) {
              _context.next = 5;
              break;
            }

            return _context.abrupt('return', (0, _deactivator2.default)(params));

          case 5:

            if (!stateParams) {
              stateParams = _instance2.default.history.getOne(function (stateParams) {
                var stateName = stateParams.stateName,
                    flags = stateParams.flags;
                var active = flags.active,
                    pending = flags.pending,
                    canceled = flags.canceled;


                if (stateName === name && (active || pending && canceled)) {
                  return true;
                }
              });
            }

            if (stateParams) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return');

          case 8:

            if (stateParams.flags.rendered) {
              (0, _deactivator2.default)(params);
            }

            _lodash2.default.extend(stateParams.flags, { active: false, pending: false });

            return _context.abrupt('return', _instance2.default.trigger('exit:' + name, stateParams).then(function (results) {
              _lodash2.default.extend(stateParams.hooks, results);
              return results;
            }));

          case 11:
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