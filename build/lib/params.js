'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('./addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataParams = _vars2.default.dataParams,
    resolveParams = _vars2.default.resolveParams;
exports.default = {
  assemble: function assemble(family, stateParams) {
    var direct = stateParams.direct,
        route = stateParams.route,
        stateName = stateParams.stateName;

    var params = { data: {}, resolves: {}, route: {} };
    var data = params.data,
        resolves = params.resolves;

    var targetEntityName = family[family.length - 1];
    var targetStateName = targetEntityName.includes('@') ? _addresser2.default.stateName(targetEntityName) : targetEntityName;
    var targetStateConfigs = _vars2.default.states.registry[targetStateName];
    var error = targetStateConfigs.error;


    if (route && targetStateConfigs.route) {
      var routeParts = targetStateConfigs.routeParts;

      if (routeParts.length) {
        var routeParamNames = routeParts.reduce(function (names, routeParamConfigs) {
          if (!_lodash2.default.isUndefined(routeParamConfigs.required)) {
            names.push(routeParamConfigs.name);
          }
          return names;
        }, []);

        var routeValues = _lodash2.default.values(_lodash2.default.pick(route.params, routeParamNames));

        _lodash2.default.extend(params, { route: _route2.default.parts.assemble(targetStateName, routeValues) });
        params.route.fragment = route.fragment;
      }
    }

    if (error) {
      _lodash2.default.extend(params, { route: route });
    }

    family.forEach(function (relation) {
      _lodash2.default.extend(data, dataParams[relation]);
      _lodash2.default.extend(resolves, resolveParams[relation]);
    });

    if (family.includes(stateName)) {
      if (direct) {
        _lodash2.default.extend(params, { direct: direct });
        _lodash2.default.extend(stateParams, { direct: direct });
      }

      _lodash2.default.extend(stateParams, { data: data, resolves: resolves });
    }

    if (!params.direct) {
      params.direct = {};
    }

    return _lodash2.default.cloneDeep(params);
  }
};