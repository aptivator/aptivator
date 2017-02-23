'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spaceSplitter = _vars2.default.spaceSplitter;

exports.default = function (selector, selectorConfigs, stateName, $parentEl, animations) {
  var selectorAddress = selector + '@' + stateName + '@' + selector;
  var selectorSettingsPath = [stateName, selectorAddress];
  var selectorSettings = _lodash2.default.get(animations, selectorSettingsPath);

  if (!selectorSettings) {
    _lodash2.default.set(animations, selectorSettingsPath, selectorSettings = { $el: $parentEl.find(selector), classes: [] });
  }

  if (!_lodash2.default.isObject(selectorConfigs)) {
    selectorConfigs = { classes: selectorConfigs };
  }

  var _selectorConfigs = selectorConfigs,
      selectorClasses = _selectorConfigs.classes,
      add = _selectorConfigs.add,
      remove = _selectorConfigs.remove;


  if (_lodash2.default.isNull(selectorClasses)) {
    return delete animations[stateName][selectorAddress];
  }

  if (_lodash2.default.isString(selectorClasses)) {
    selectorClasses = selectorClasses.trim().split(spaceSplitter);
  }

  if (add && remove) {
    remove = false;
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