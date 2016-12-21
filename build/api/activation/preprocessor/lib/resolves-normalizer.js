'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _relations = require('../../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (configs, stateName) {
  var resolves = configs.resolve;
  var family = _relations2.default.family(stateName).reverse();

  _lodash2.default.each(resolves, function (resolveConfigs, resolveName) {
    _lodash2.default.isFunction(resolveConfigs) && (resolveConfigs = { resolver: resolveConfigs });

    if (_lodash2.default.isUndefined(resolveConfigs.persist)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = family[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var relation = _step.value;

          var stateConfigs = _vars2.default.states.registry[relation];
          if (!_lodash2.default.isUndefined(stateConfigs.persistResolves)) {
            resolveConfigs.persist = stateConfigs.persistResolves;
            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    if (_lodash2.default.isUndefined(configs.changingResolves) && !resolveConfigs.persist && resolveConfigs.store) {
      configs.changingResolves = true;
    }

    resolves[resolveName] = resolveConfigs;
  });

  return _lodash2.default.clone(resolves);
};