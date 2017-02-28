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

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deactivating = _vars2.default.deactivating,
    states = _vars2.default.states;
var registry = states.registry;

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    var name, partial, stateConfigs, query, stateParams, family;
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

            throw { errorType: 'undeclared', errorMessage: 'state [' + name + '] does not exist' };

          case 6:
            query = { stateName: name, flags: { active: true } };
            stateParams = _instance2.default.history.findOne(query);
            family = _relations2.default.family(name);

            if (stateParams) {
              _context.next = 11;
              break;
            }

            throw { errorType: 'inactive', errorMessage: 'state [' + name + '] is not activated' };

          case 11:

            deactivating.push(name);

            _lodash2.default.extend(stateParams.flags, { deactivating: true, partial: partial });

            _lodash2.default.each(family, function (relation) {
              var stateConfigs = registry[relation];
              _lodash2.default.each(stateConfigs.states, function (stateParams) {
                var name = stateParams.name;

                _instance2.default.deactivate({ name: name }).catch(_lodash2.default.noop);
              });
            });

            return _context.abrupt('return', stateParams);

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