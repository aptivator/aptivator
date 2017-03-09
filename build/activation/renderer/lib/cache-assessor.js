'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _params = require('../../../lib/params');

var _params2 = _interopRequireDefault(_params);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var paramsMap = _vars2.default.paramsMap,
    states = _vars2.default.states;
var registry = states.registry;
exports.default = {
  explicit: function explicit(viewConfigs) {
    var stateName = viewConfigs.stateName,
        record = viewConfigs.record,
        viewCacheFlag = viewConfigs.cache;
    var instance = record.instance;

    var stateConfigs = registry[stateName];
    var stateCacheFlag = stateConfigs.cache;

    var cache = void 0;

    if (instance) {
      if (!_lodash2.default.isUndefined(viewCacheFlag)) {
        cache = viewCacheFlag;
      } else if (!_lodash2.default.isUndefined(stateCacheFlag)) {
        cache = stateCacheFlag;
      }
    }

    return this.explicit.cache = cache;
  },
  implicit: function implicit(viewConfigs, stateParams) {
    var uniqueAddress = viewConfigs.uniqueAddress,
        record = viewConfigs.record;

    var params = _params2.default.assemble(uniqueAddress, stateParams);

    delete params.data;

    if (params.route) {
      delete params.route.fragment;
      delete params.route.stateName;
    }

    if (record.instance && _lodash2.default.isEqual(paramsMap[uniqueAddress], params)) {
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