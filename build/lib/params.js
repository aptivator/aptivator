'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('./addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _relations = require('./relations');

var _relations2 = _interopRequireDefault(_relations);

var _routeAssembler = require('./route/route-assembler');

var _routeAssembler2 = _interopRequireDefault(_routeAssembler);

var _vars = require('./vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataParams = _vars2.default.dataParams,
    resolveParams = _vars2.default.resolveParams;
exports.default = {
  assemble: function assemble(entityName, stateParams) {
    var direct = stateParams.direct,
        route = stateParams.route,
        stateName = stateParams.stateName,
        hooks = stateParams.hooks;

    var params = { data: {}, resolves: {}, route: {}, direct: {}, hooks: {} };
    var data = params.data,
        resolves = params.resolves;

    var family = _relations2.default.family(entityName);
    var targetEntityName = _lodash2.default.nth(family, -1);
    var targetStateName = _addresser2.default.stateName(targetEntityName);
    var targetStateConfigs = _vars2.default.states.registry[targetStateName];
    var error = targetStateConfigs.error,
        routeConfigs = targetStateConfigs.route;


    if (route && !_lodash2.default.isEmpty(routeConfigs)) {
      var parts = routeConfigs.parts;

      var names = _lodash2.default.reduce(parts, function (names, part) {
        var name = part.name,
            required = part.required;


        if (!_lodash2.default.isUndefined(required)) {
          names.push(name);
        }
        return names;
      }, []);

      var values = _lodash2.default.values(_lodash2.default.pick(route.params, names));

      if (values.length) {
        _lodash2.default.extend(params, { route: (0, _routeAssembler2.default)(targetStateName, values) });
      }
    }

    if (error) {
      _lodash2.default.extend(params, { route: route });
    }

    family.forEach(function (relation) {
      _lodash2.default.extend(data, dataParams[relation]);
      _lodash2.default.extend(resolves, resolveParams[relation]);
    });

    _lodash2.default.each(hooks, function (hookValues, hookName) {
      var values = [['v'], [targetStateName, 'v']].reduce(function (values, path) {
        return _lodash2.default.extend(values, _lodash2.default.get(hookValues, path, {}));
      }, {});

      if (!_lodash2.default.isEmpty(values)) {
        params.hooks[hookName] = values;
      }
    });

    if (family.includes(stateName)) {
      if (direct) {
        _lodash2.default.extend(params, { direct: direct });
        _lodash2.default.extend(stateParams, { direct: direct });
      }

      _lodash2.default.extend(stateParams, { data: data, resolves: resolves });
    }

    return _lodash2.default.cloneDeep(params);
  }
};