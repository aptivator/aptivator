'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _instance = require('../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _deactivator = require('./deactivator/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.deactivate = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    var name, stateParams, silent, results;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = params.name, stateParams = params.stateParams, silent = params.silent;


            if (!_addresser2.default.isStateAddress(name)) {
              silent = true;
            }

            if (!silent) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', (0, _deactivator2.default)(params));

          case 4:

            console.log('deactivating ' + name);

            if (!stateParams) {
              stateParams = _instance2.default.history.findOne(function (stateParams) {
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

            _lodash2.default.extend(stateParams.flags, { active: false, pending: false });

            if (stateParams.flags.rendered) {
              _context.next = 11;
              break;
            }

            return _context.abrupt('return', stateParams.flags.canceled = true);

          case 11:
            _context.next = 13;
            return _instance2.default.trigger({ handle: 'exit:' + name, full: true }, stateParams);

          case 13:
            results = _context.sent;


            (0, _deactivator2.default)(params);

          case 15:
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