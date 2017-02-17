'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = animationsAssembler;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _selectorAssembler = require('./selector-assembler/selector-assembler');

var _selectorAssembler2 = _interopRequireDefault(_selectorAssembler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spaceSplitter = _vars2.default.spaceSplitter,
    states = _vars2.default.states;
var activationRecords = states.activationRecords,
    registry = states.registry;
function animationsAssembler(stateName, animationType, animations, origin) {
  var _registry$stateName = registry[stateName],
      viewsRegistry = _registry$stateName.viewsRegistry,
      _registry$stateName$a = _registry$stateName.animate,
      animate = _registry$stateName$a === undefined ? {} : _registry$stateName$a;
  var _animate$animationTyp = animate[animationType],
      typeSettings = _animate$animationTyp === undefined ? {} : _animate$animationTyp;


  if (typeSettings.self) {
    delete typeSettings[stateName];
  }

  if (typeSettings[stateName]) {
    typeSettings.self = typeSettings[stateName];
    delete typeSettings[stateName];
  }

  var _ref = typeSettings || {},
      self_ = _ref.self;

  if (!_lodash2.default.isObject(self_)) {
    self_ = { base: self_ };
  }

  var _self_ = self_,
      base = _self_.base;


  if (!_lodash2.default.isObject(base)) {
    base = { classes: base };
  }

  var _base = base,
      baseClasses = _base.classes,
      baseAdd = _base.add,
      baseRemove = _base.remove;


  if (baseAdd && baseRemove) {
    baseRemove = false;
  }

  if (_lodash2.default.isString(baseClasses)) {
    baseClasses = baseClasses.trim().split(spaceSplitter);
  }

  _lodash2.default.each(viewsRegistry, function (viewConfigs, viewAddressUnique) {
    var _ref2 = activationRecords[viewAddressUnique] || {},
        active = _ref2.active,
        instance = _ref2.instance;

    var $el = instance.$el;
    var viewHash = viewConfigs.viewHash,
        animate = viewConfigs.animate,
        viewStateName = viewConfigs.viewStateName;

    var viewSettingsPath = [stateName, viewHash];
    var viewSettings = _lodash2.default.get(animations, viewSettingsPath);

    if (!viewSettings) {
      _lodash2.default.set(animations, viewSettingsPath, viewSettings = { $el: $el, classes: [] });
    }

    var _viewSettings = viewSettings,
        classes = _viewSettings.classes;


    if (!active) {
      return _error2.default.warn('state [' + stateName + '] is not activated', 'animator');
    }

    if (viewStateName !== stateName) {
      if (baseClasses === false) {
        _lodash2.default.remove(classes, function () {
          return true;
        });
      } else if (baseClasses) {
        if (baseAdd) {
          classes.push.apply(classes, (0, _toConsumableArray3.default)(baseClasses));
        } else if (baseRemove) {
          _lodash2.default.remove(classes, function (klass) {
            return baseClasses.includes(klass);
          });
        } else {
          classes.splice.apply(classes, [0, classes.length].concat((0, _toConsumableArray3.default)(baseClasses)));
        }
      }
    }

    if (animate === false) {
      animate = (0, _defineProperty3.default)({}, animationType, animate);
    }

    var _ref3 = animate || {};

    animate = _ref3[animationType];


    if (!origin || _lodash2.default.isUndefined(animate)) {
      animate = self_[viewHash];
    }

    if (!_lodash2.default.isObject(animate)) {
      animate = { classes: animate };
    }

    var _animate2 = animate,
        viewClasses = _animate2.classes,
        add = _animate2.add,
        remove = _animate2.remove;


    if (_lodash2.default.isString(viewClasses)) {
      viewClasses = viewClasses.trim().split(spaceSplitter);
    }

    if (add && remove) {
      _error2.default.throw('for [' + viewHash + '] view animations, in [' + stateName + '], specify either \'add\' or \'remove\' flag', 'animator');
    }

    if (_lodash2.default.isUndefined(viewClasses) && baseClasses === false) {
      viewClasses = false;
    }

    if (viewClasses === false) {
      return delete animations[stateName][viewHash];
    }

    if (_lodash2.default.isUndefined(viewClasses)) {
      return;
    }

    if (add) {
      classes.push.apply(classes, (0, _toConsumableArray3.default)(viewClasses));
    } else if (remove) {
      _lodash2.default.remove(classes, function (klass) {
        return viewClasses.includes(klass);
      });
    } else {
      classes.splice.apply(classes, [0, classes.length].concat((0, _toConsumableArray3.default)(viewClasses)));
    }
  });

  _lodash2.default.each(_lodash2.default.omit(typeSettings, 'self'), function (animationSettings, entityName) {
    if (entityName.includes('@')) {
      return (0, _selectorAssembler2.default)(entityName, animationSettings, animations);
    }

    animationsAssembler(entityName, animationType, animations, false);
  });

  return animations;
}