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

var _aptivator = require('../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _inactor = require('./lib/inactor');

var _inactor2 = _interopRequireDefault(_inactor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deactivating = _vars2.default.deactivating,
    states = _vars2.default.states;
var registry = states.registry;

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    var name, partial, stateConfigs, query, statesParams, stateParams, flags, family;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = params.name, partial = params.partial;
            stateConfigs = registry[name];

            if (!deactivating.includes(name)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return');

          case 4:
            if (stateConfigs) {
              _context.next = 6;
              break;
            }

            throw { type: 'undeclared', message: 'state [' + name + '] does not exist' };

          case 6:
            query = { stateName: name, flags: { active: true } };
            statesParams = _aptivator2.default.history.find(query);
            stateParams = statesParams[0];

            if (stateParams) {
              _context.next = 11;
              break;
            }

            return _context.abrupt('return');

          case 11:

            (0, _inactor2.default)(statesParams.slice(1));

            flags = stateParams.flags;
            family = flags.spliced ? [name] : _relations2.default.family(name);


            deactivating.push(name);

            _lodash2.default.extend(flags, { deactivating: true, partial: partial });

            _lodash2.default.each(family, function (relation) {
              var stateConfigs = registry[relation];
              _lodash2.default.each(stateConfigs.states, function (stateParams) {
                var name = stateParams.name;

                _aptivator2.default.deactivate({ name: name }).catch(_lodash2.default.noop);
              });
            });

            return _context.abrupt('return', stateParams);

          case 18:
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