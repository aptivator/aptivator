'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _params = require('../../../lib/params');

var _params2 = _interopRequireDefault(_params);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paramsMap = _vars2.default.paramsMap,
    states = _vars2.default.states;
var registry = states.registry;
exports.default = {
  explicit: function explicit(viewConfigs) {
    var stateName = viewConfigs.stateName,
        rendering = viewConfigs.rendering,
        viewCache = viewConfigs.cache;

    var stateConfigs = registry[stateName];
    var stateCache = stateConfigs.cache;
    var instance = rendering.record.instance;

    var cache = void 0;

    if (instance) {
      cache = viewCache || stateCache;
    }

    return this.explicit.cache = cache;
  },
  implicit: function implicit(viewConfigs, stateParams) {
    var uniqueAddress = viewConfigs.uniqueAddress,
        stateName = viewConfigs.stateName;

    var family = _relations2.default.family(uniqueAddress);
    var params = _params2.default.assemble(family, stateParams);

    delete params.data;

    if (params.route) {
      delete params.route.fragment;
      delete params.route.stateName;
    }

    if (stateName === 'app-2.about') {
      console.log(paramsMap[uniqueAddress], params, _lodash2.default.isEqual(paramsMap[uniqueAddress], params));
    }

    if (_lodash2.default.isEqual(paramsMap[uniqueAddress], params)) {
      return this.implicit.cache = true;
    }

    paramsMap[uniqueAddress] = params;

    return this.implicit.cache = false;
  },
  total: function total(viewConfigs, stateParams) {
    this.implicit(viewConfigs, stateParams);

    if (!_lodash2.default.isUndefined(this.explicit(viewConfigs))) {
      return this.explicit.cache;
    }

    return this.implicit.cache;
  }
};