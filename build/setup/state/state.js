'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _route = require('../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _otherStateRegistrar = require('./lib/other-state-registrar');

var _otherStateRegistrar2 = _interopRequireDefault(_otherStateRegistrar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    registry = _vars$states.registry,
    queue = _vars$states.queue;

var rootStateProperties = ['view', 'resolves', 'data', 'route', 'resolveConfigs', 'detachHidden'];

_instance2.default.state = function (stateName, stateConfigs) {
  return !(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var root, parentStateName, parentConfigs, routeParts, routeValues, route, routeRx;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (registry[stateName]) {
              _error2.default.throw('state [' + stateName + '] has already been declared', 'state declaration');
            }

            if (_relations2.default.isRoot(stateName)) {
              root = true;

              stateConfigs = _lodash2.default.pick(stateConfigs, rootStateProperties);
              _lodash2.default.extend(stateConfigs, { viewAddressUnique: stateName });

              if (!stateConfigs.resolveConfigs) {
                stateConfigs.resolveConfigs = {
                  persist: true,
                  store: true
                };
              }

              if (_lodash2.default.isUndefined(stateConfigs.detachHidden)) {
                stateConfigs.detachHidden = false;
              }
            }

            parentStateName = root ? null : _relations2.default.parent(stateName);
            parentConfigs = root ? {} : registry[parentStateName];

            if (parentConfigs) {
              _context.next = 7;
              break;
            }

            queue.push([stateName, stateConfigs]);
            return _context.abrupt('return', _instance2.default);

          case 7:

            if (stateConfigs.transient || stateConfigs.error) {
              (0, _otherStateRegistrar2.default)(stateName, _vars2.default.states[stateConfigs.transient ? 'transient' : 'error']);
              delete stateConfigs.route;
            }

            registry[stateName] = stateConfigs;

            if (stateConfigs.route) {
              {
                routeParts = _route2.default.parts.parse(parentConfigs, stateConfigs);
                routeValues = (parentConfigs.routeValues || []).concat(stateConfigs.routeValues || []);
                route = '' + (parentConfigs.route && parentConfigs.route + '/' || '') + stateConfigs.route;
                routeRx = _backbone2.default.Router.prototype._routeToRegExp(route);

                _lodash2.default.extend(stateConfigs, { route: route, routeParts: routeParts, routeRx: routeRx, routeValues: routeValues });
              }

              if (!stateConfigs.abstract) {
                _vars2.default.router.route(stateConfigs.route, stateName, function () {
                  for (var _len = arguments.length, routeValues = Array(_len), _key = 0; _key < _len; _key++) {
                    routeValues[_key] = arguments[_key];
                  }

                  var route = _route2.default.parts.assemble(stateName, routeValues.filter(function (value) {
                    return value;
                  }));
                  _instance2.default.activate({ stateName: stateName, route: route }).catch(_lodash2.default.noop);
                });
              }
            }

            return _context.abrupt('return', _vars2.default.states.queue.length ? _instance2.default.state.apply(_instance2.default, (0, _toConsumableArray3.default)(_vars2.default.states.queue.pop())) : _instance2.default);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }))().catch(_error2.default.errorer);
};