'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _route = require('../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _vars2.default.router;

exports.default = function (stateConfigs, parentConfigs) {
  var abstract = stateConfigs.abstract,
      stateName = stateConfigs.stateName;


  var routeParts = _route2.default.parts.parse(parentConfigs, stateConfigs);
  var routeValues = (parentConfigs.routeValues || []).concat(stateConfigs.routeValues || []);
  var route = '' + (parentConfigs.route && parentConfigs.route + '/' || '') + stateConfigs.route;
  var routeRx = _backbone2.default.Router.prototype._routeToRegExp(route);

  _lodash2.default.extend(stateConfigs, { route: route, routeParts: routeParts, routeRx: routeRx, routeValues: routeValues });

  if (!abstract) {
    router.route(route, stateName, function () {
      for (var _len = arguments.length, routeValues = Array(_len), _key = 0; _key < _len; _key++) {
        routeValues[_key] = arguments[_key];
      }

      var route = _route2.default.parts.assemble(stateName, _lodash2.default.compact(routeValues));
      _instance2.default.activate({ stateName: stateName, route: route }).catch(_lodash2.default.noop);
    });
  }
};