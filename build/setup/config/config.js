'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_instance2.default.config = function (rootConfigs) {
  if (!rootConfigs.resolveConfigs) {
    rootConfigs.resolveConfigs = {
      persist: true,
      store: true
    };
  }

  if (_lodash2.default.isUndefined(rootConfigs.detachHidden)) {
    rootConfigs.detachHidden = false;
  }

  _vars2.default.states.registry[_vars2.default.rootStateName] = rootConfigs;

  return _instance2.default;
};