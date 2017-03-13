'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _aptivator = require('../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _error = require('../lib/error');

var _error2 = _interopRequireDefault(_error);

var _fragment = require('../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _vars = require('../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _missingParentsAssembler = require('./lib/missing-parents-assembler');

var _missingParentsAssembler2 = _interopRequireDefault(_missingParentsAssembler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var queue = _vars2.default.states.queue;


_aptivator2.default.start = function () {
  return !(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var defaultState, missingParents;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            defaultState = _vars2.default.configs.defaultState;


            if (queue.length) {
              missingParents = (0, _missingParentsAssembler2.default)(queue);

              _error2.default.throw('undeclared parent states: [' + missingParents + ']', 'starter');
            }

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
              _aptivator2.default.activate({ stateName: defaultState, direct: { running: true, spliced: true } }).catch(_lodash2.default.noop);
            }

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }))().catch(_error2.default.errorer);
};