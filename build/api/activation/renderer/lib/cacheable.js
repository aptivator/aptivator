'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _relations = require('../../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _params = require('../../../../lib/params');

var _params2 = _interopRequireDefault(_params);

var _vars = require('../../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paramsMap = {};

exports.default = {
  explicit: function explicit(viewConfigs) {
    var stateConfigs = _vars2.default.states.registry[viewConfigs.stateName];
    return this.explicit.cache = !_lodash2.default.isUndefined(viewConfigs.cache) ? viewConfigs.cache : !_lodash2.default.isUndefined(stateConfigs.cache) ? stateConfigs.cache : undefined;
  },

  implicit: function implicit(viewConfigs, stateParams, cacheAddress) {
    var stateName = viewConfigs.stateName,
        viewAddressUnique = viewConfigs.viewAddressUnique;

    var family = _relations2.default.family(stateName).concat(viewAddressUnique);
    var parameters = _params2.default.assemble(family, stateParams);

    delete parameters.data;

    if (parameters.route) {
      delete parameters.route.fragment;
      delete parameters.route.stateName;
    }

    if (_lodash2.default.isEqual(paramsMap[cacheAddress], parameters)) {
      return this.implicit.cache = true;
    }

    paramsMap[cacheAddress] = parameters;

    return this.implicit.cache = false;
  },

  total: function total(viewConfigs, stateParams, cacheAddress) {
    this.implicit(viewConfigs, stateParams, cacheAddress);

    if (!_lodash2.default.isUndefined(this.explicit(viewConfigs))) {
      return this.explicit.cache;
    }

    return this.implicit.cache;
  }
};