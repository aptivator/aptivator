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

var _routeAssembler = require('../../lib/route/route-assembler');

var _routeAssembler2 = _interopRequireDefault(_routeAssembler);

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


  if (_lodash2.default.isString(route)) {
    route = { path: route };
    _lodash2.default.extend(stateConfigs, { route: route });
  }

  var _route = route,
      _route$path = _route.path,
      path = _route$path === undefined ? '' : _route$path;
  var _parentRoute$path = parentRoute.path,
      parentPath = _parentRoute$path === undefined ? '' : _parentRoute$path;

  path = (parentPath && parentPath + '/') + path;

  if (path) {
    var rx = _backbone2.default.Router.prototype._routeToRegExp(path);
  }

  (0, _routeParser2.default)(route, parentRoute);
  (0, _valuesAssertersAssembler2.default)(route, parentRoute);
  _lodash2.default.extend(route, { path: path, rx: rx });

  if (!abstract) {
    router.route(rx, stateName, function () {
      for (var _len = arguments.length, routeValues = Array(_len), _key = 0; _key < _len; _key++) {
        routeValues[_key] = arguments[_key];
      }

      try {
        var _route2 = (0, _routeAssembler2.default)(stateName, _lodash2.default.compact(routeValues), true);
        _aptivator2.default.activate({ stateName: stateName, route: _route2 }).catch(_lodash2.default.noop);
      } catch (e) {
        console.error(e);
      }
    });
  }
};