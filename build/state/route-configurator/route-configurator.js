'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _aptivator = require('../../lib/aptivator');

var _aptivator2 = _interopRequireDefault(_aptivator);

var _route = require('../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _routeParser = require('./lib/route-parser');

var _routeParser2 = _interopRequireDefault(_routeParser);

var _valuesAssertersAssembler = require('./lib/values-asserters-assembler');

var _valuesAssertersAssembler2 = _interopRequireDefault(_valuesAssertersAssembler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _vars2.default.router;

exports.default = function (stateConfigs, parentConfigs) {
  var abstract = stateConfigs.abstract,
      stateName = stateConfigs.stateName,
      route = stateConfigs.route;
  var _parentConfigs$route = parentConfigs.route,
      parentRoute = _parentConfigs$route === undefined ? {} : _parentConfigs$route;
  var _route$path = route.path,
      path = _route$path === undefined ? '' : _route$path;
  var _parentRoute$path = parentRoute.path,
      parentPath = _parentRoute$path === undefined ? '' : _parentRoute$path;


  if (path && !abstract) {
    path = (parentPath && parentPath + '/') + path;
    var rx = _backbone2.default.Router.prototype._routeToRegExp(path);
  }

  (0, _routeParser2.default)(route, parentRoute);

  (0, _valuesAssertersAssembler2.default)(route, parentRoute);

  _lodash2.default.extend(route, { path: path, rx: rx });

  console.log(route);

  if (rx) {
    router.route(rx, stateName, function () {
      for (var _len = arguments.length, routeValues = Array(_len), _key = 0; _key < _len; _key++) {
        routeValues[_key] = arguments[_key];
      }

      var route = _route2.default.parts.assemble(stateName, _lodash2.default.compact(routeValues));
      _aptivator2.default.activate({ stateName: stateName, route: route }).catch(_lodash2.default.noop);
    });
  }
};