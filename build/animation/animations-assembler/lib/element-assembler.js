'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _params2 = require('../../../lib/params');

var _params3 = _interopRequireDefault(_params2);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spaceSplitter = _vars2.default.spaceSplitter;

exports.default = function (params) {
  var selector = params.selector,
      selectorConfigs = params.selectorConfigs,
      stateName = params.stateName,
      uniqueAddress = params.uniqueAddress,
      stateParams = params.stateParams,
      $parentEl = params.$el,
      animations = params.animations;

  var entityName = stateName || uniqueAddress;
  var selectorAddress = selector + '@' + entityName + '@' + selector;
  var selectorSettingsPath = [entityName, selectorAddress];
  var selectorSettings = _lodash2.default.get(animations, selectorSettingsPath);

  if (!selectorSettings) {
    _lodash2.default.set(animations, selectorSettingsPath, selectorSettings = { $el: $parentEl.find(selector), classes: [] });
  }

  if (!_lodash2.default.isPlainObject(selectorConfigs)) {
    selectorConfigs = { classes: selectorConfigs };
  }

  var _selectorConfigs = selectorConfigs,
      selectorClasses = _selectorConfigs.classes,
      add = _selectorConfigs.add,
      remove = _selectorConfigs.remove;


  if (_lodash2.default.isFunction(selectorClasses)) {
    var _params = _params3.default.assemble(entityName, stateParams);
    selectorClasses = selectorClasses(_params);
  }

  if (_lodash2.default.isNull(selectorClasses)) {
    return delete animations[entityName][selectorAddress];
  }

  if (_lodash2.default.isString(selectorClasses)) {
    selectorClasses = selectorClasses.trim().split(spaceSplitter);
  }

  var _selectorSettings = selectorSettings,
      classes = _selectorSettings.classes;


  if (add) {
    classes.push.apply(classes, (0, _toConsumableArray3.default)(selectorClasses));
  } else if (remove) {
    _lodash2.default.remove(classes, function (klass) {
      return selectorClasses.includes(klass);
    });
  } else {
    classes.splice.apply(classes, [0, classes.length].concat((0, _toConsumableArray3.default)(selectorClasses)));
  }
};