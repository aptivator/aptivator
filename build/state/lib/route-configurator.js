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

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _route = require('../../lib/route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _vars2.default.router;


var valuesAssembler = function valuesAssembler(route, parentRoute) {
  var params = route.params;
  var _parentRoute$values = parentRoute.values,
      parentValues = _parentRoute$values === undefined ? [] : _parentRoute$values,
      parentHasParams = parentRoute.hasParams;

  var values = _lodash2.default.map(params, function (param) {
    return param.value;
  });
  values = _lodash2.default.compact(values);

  if (_lodash2.default.isEmpty(values)) {
    return values;
  }

  if (values.length !== params.length) {
    _error2.default.throw('number of default values should equal to the number of route parameters', 'routing');
  }

  if (_lodash2.default.isEmpty(parentValues) && parentHasParams) {
    _error2.default.throw('to assemble child values provide parent values', 'routing');
  }

  return parentValues.concat(values);
};

exports.default = function (stateConfigs, parentConfigs) {
  var abstract = stateConfigs.abstract,
      stateName = stateConfigs.stateName,
      route = stateConfigs.route;
  var _parentConfigs$route = parentConfigs.route,
      parentRoute = _parentConfigs$route === undefined ? {} : _parentConfigs$route;
  var path = route.path;
  var _parentRoute$path = parentRoute.path,
      parentPath = _parentRoute$path === undefined ? '' : _parentRoute$path;


  var parts = _route2.default.parts.parse(route, parentRoute);
  path = (parentPath && parentPath + '/') + path;

  if (path && !abstract) {
    var rx = _backbone2.default.Router.prototype._routeToRegExp(path);
  }

  var values = valuesAssembler(route, parentRoute);

  console.log(parts, path, rx, values);

  return;

  var routeValues = (parentConfigs.routeValues || []).concat(stateConfigs.routeValues || []);

  _lodash2.default.extend(stateConfigs, { route: route, routeParts: routeParts, routeRx: routeRx, routeValues: routeValues });

  if (rx) {
    router.route(route, stateName, function () {
      for (var _len = arguments.length, routeValues = Array(_len), _key = 0; _key < _len; _key++) {
        routeValues[_key] = arguments[_key];
      }

      var route = _route2.default.parts.assemble(stateName, _lodash2.default.compact(routeValues));
      _aptivator2.default.activate({ stateName: stateName, route: route }).catch(_lodash2.default.noop);
    });
  }
};