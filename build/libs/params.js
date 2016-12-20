'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  assemble: function assemble(family, stateParams) {
    var clone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var targetStateName = stateParams.stateName,
        dataParams = stateParams.dataParams,
        routeParams = stateParams.routeParams,
        directParams = stateParams.directParams,
        resolveParams = stateParams.resolveParams;

    var data = {};
    var resolves = {};

    family.forEach(function (relation) {
      _lodash2.default.extend(data, dataParams[relation]);
      _lodash2.default.extend(resolves, resolveParams[relation]);
    });

    var allParams = { data: data, resolves: resolves, route: routeParams };

    if (family.includes(targetStateName) && directParams) {
      allParams.direct = directParams;
    }

    return clone ? _lodash2.default.cloneDeep(allParams) : allParams;
  }
};