'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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

    var params = { data: {}, resolves: {}, route: route };
    var data = params.data,
        resolves = params.resolves;


    family.forEach(function (relation) {
      _lodash2.default.extend(data, dataParams[relation]);
      _lodash2.default.extend(resolves, resolveParams[relation]);
    });

    if (family.includes(stateName)) {
      _lodash2.default.extend(params, { direct: direct });
      _lodash2.default.extend(stateParams, { data: data, resolves: resolves });
    }

    return _lodash2.default.cloneDeep(params);
  }
};