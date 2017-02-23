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

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _fragment = require('../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  var defaultState;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          defaultState = _vars2.default.configs.defaultState;


          _backbone2.default.history.start();

          /*
           aptivator.activate({name: 'app-1'});
          aptivator.activate({name: 'app-2.form', flags: {parallel: true}});
          aptivator.activate({name: 'app-2.info', flags: {parallel: true}});
           setTimeout(() => {
            aptivator.deactivate({name: 'app-2.form'});
            aptivator.deactivate({name: 'app-2.info'});
          }, 5000);
          
          */

          if (!_fragment2.default.get() && defaultState) {
            _instance2.default.activate({ stateName: defaultState, direct: { running: true } }).catch(_lodash2.default.noop);
          }

        case 3:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));