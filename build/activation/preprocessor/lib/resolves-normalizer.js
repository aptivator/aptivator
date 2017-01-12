'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var persistFlag = 1,
    storeFlag = 2,
    bothFlags = 1 | 2;

exports.default = function (configs, entityName) {
  var resolves = configs.resolve;
  var hasAt = entityName.includes('@');
  var stateName = hasAt ? _addresser2.default.stateName(entityName) : entityName;
  var family = _relations2.default.family(stateName).reverse();

  _lodash2.default.each(resolves, function (resolveConfigs, resolveName) {
    var status;

    if (_lodash2.default.isFunction(resolveConfigs)) {
      resolveConfigs = { resolver: resolveConfigs };
    }

    if (!_lodash2.default.isUndefined(resolveConfigs.persist)) {
      status |= persistFlag;
    }

    if (!_lodash2.default.isUndefined(resolveConfigs.store)) {
      status |= storeFlag;
    }

    !function normalizeResolves() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var viewConfigs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : hasAt && configs;

      if (index >= family.length || status === bothFlags) {
        return;
      }

      var stateConfigs = viewConfigs;

      if (!stateConfigs) {
        stateConfigs = _vars2.default.states.registry[family[index++]];
      }

      if (stateConfigs.resolveConfigs) {
        if (!(status & persistFlag) && !_lodash2.default.isUndefined(stateConfigs.resolveConfigs.persist)) {
          resolveConfigs.persist = stateConfigs.resolveConfigs.persist;
          status |= persistFlag;
        }

        if (!(status & storeFlag) && !_lodash2.default.isUndefined(stateConfigs.resolveConfigs.store)) {
          resolveConfigs.store = stateConfigs.resolveConfigs.store;
          status |= storeFlag;
        }
      }

      normalizeResolves(index, null);
    }();

    resolves[resolveName] = resolveConfigs;
  });

  return _lodash2.default.clone(resolves);
};