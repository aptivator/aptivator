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
    var clone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var stateName = stateParams.stateName,
        routeParams = stateParams.routeParams,
        directParams = stateParams.directParams;

    var params = { dataParams: {}, resolveParams: {}, routeParams: routeParams };

    family.forEach(function (relation) {
      _lodash2.default.extend(params.dataParams, dataParams[relation]);
      _lodash2.default.extend(params.resolveParams, resolveParams[relation]);
    });

    if (family.includes(stateName)) {
      _lodash2.default.extend(params, { directParams: directParams });
      _lodash2.default.extend(stateParams, { resolveParams: params.resolveParams, dataParams: params.dataParams });
    }

    return params;
  }
};