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

exports.default = {
  assemble: function assemble(family, stateParams) {
    var clone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var stateName = stateParams.stateName,
        dataParams = stateParams.dataParams,
        routeParams = stateParams.routeParams,
        directParams = stateParams.directParams,
        resolveParams = stateParams.resolveParams;

    var data = {};
    var resolves = {};
    var targetStateName = family[family.length - 1];
    targetStateName = targetStateName.includes('@') ? _addresser2.default.stateName(targetStateName) : targetStateName;
    var stateConfigs = _vars2.default.states.registry[targetStateName];

    if (stateConfigs.routeParts) {
      var routeParamsNames = stateConfigs.routeParts.reduce(function (names, routePart) {
        if (!_lodash2.default.isUndefined(routePart.required)) {
          names.push(routePart.name);
        }

        return names;
      }, []);
    }

    var routeValues = !routeParams ? [] : _lodash2.default.values(_lodash2.default.pick(routeParams.params, routeParamsNames));

    family.forEach(function (relation) {
      _lodash2.default.extend(data, dataParams[relation]);
      _lodash2.default.extend(resolves, resolveParams[relation]);
    });

    var allParams = { data: data, resolves: resolves };

    if (stateConfigs.route) {
      _lodash2.default.extend(allParams, {
        route: _route2.default.parts.assemble(targetStateName, routeValues)
      });
    }

    allParams.direct = family.includes(stateName) ? directParams : undefined;

    return clone ? _lodash2.default.cloneDeep(allParams) : allParams;
  }
};