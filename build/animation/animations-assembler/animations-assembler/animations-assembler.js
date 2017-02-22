'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.default = animationsAssembler;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _elementAssembler = require('./element-assembler/element-assembler');

var _elementAssembler2 = _interopRequireDefault(_elementAssembler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spaceSplitter = _vars2.default.spaceSplitter,
    states = _vars2.default.states;
var activationRecords = states.activationRecords,
    registry = states.registry;
function animationsAssembler(stateName, animationType, animations, fromStateName) {
  var _registry$stateName = registry[stateName],
      viewsRegistry = _registry$stateName.viewsRegistry,
      _registry$stateName$a = _registry$stateName.animate,
      animate = _registry$stateName$a === undefined ? {} : _registry$stateName$a,
      uniqueAddress = _registry$stateName.uniqueAddress;
  var _animate$animationTyp = animate[animationType],
      animationSettings = _animate$animationTyp === undefined ? {} : _animate$animationTyp;
  var _activationRecords$un = activationRecords[uniqueAddress],
      active = _activationRecords$un.active,
      instance = _activationRecords$un.instance;
  var $el = instance.$el;

  var stateNameToUse = stateName;

  if (!_lodash2.default.isObject(animationSettings)) {
    animationSettings = (0, _defineProperty3.default)({}, stateNameToUse, animationSettings);
  }

  if (fromStateName) {
    var family = _relations2.default.family(fromStateName);
    if (!family.includes(stateName) && !active) {
      return _error2.default.warn('state [' + stateName + '] is not activated', 'animator');
    }

    var _ref = registry[fromStateName].animate || {};

    var _ref$animationType = _ref[animationType];
    animationSettings = _ref$animationType === undefined ? {} : _ref$animationType;
  } else {
    if (animationSettings.self) {
      delete animationSettings[stateName];
      stateNameToUse = 'self';
    }
  }

  var _animationSettings2 = animationSettings,
      self_ = _animationSettings2[stateNameToUse];


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


  if (_lodash2.default.isString(baseClasses)) {
    baseClasses = baseClasses.trim().split(spaceSplitter);
  }

  _lodash2.default.each(self_.elements, function (selectorConfigs, selector) {
    (0, _elementAssembler2.default)(selector, selectorConfigs, stateName, $el, animations);
  });

  _lodash2.default.each(viewsRegistry, function (viewConfigs, uniqueAddress) {
    var $el = activationRecords[uniqueAddress].instance.$el;
    var viewHash = viewConfigs.viewHash,
        animate = viewConfigs.animate,
        addressStateName = viewConfigs.addressStateName;

    var viewSettingsPath = [stateName, viewHash];
    var viewSettings = _lodash2.default.get(animations, viewSettingsPath);

    if (!viewSettings) {
      _lodash2.default.set(animations, viewSettingsPath, viewSettings = { $el: $el, classes: [] });
    }

    var _viewSettings = viewSettings,
        classes = _viewSettings.classes;


    if (addressStateName !== stateName) {
      if (_lodash2.default.isNull(baseClasses)) {
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

    if (!_lodash2.default.isObject(animate)) {
      animate = (0, _defineProperty3.default)({}, animationType, animate);
    }

    var _ref2 = animate || {};

    animate = _ref2[animationType];


    if (fromStateName || _lodash2.default.isUndefined(animate)) {
      animate = self_[viewHash];
    }

    if (!_lodash2.default.isObject(animate)) {
      animate = { classes: animate };
    }

    var _animate2 = animate,
        viewClasses = _animate2.classes,
        add = _animate2.add,
        remove = _animate2.remove,
        elements = _animate2.elements;


    _lodash2.default.each(elements, function (selectorConfigs, selector) {
      (0, _elementAssembler2.default)(selector, selectorConfigs, stateName, $el, animations);
    });

    if (_lodash2.default.isString(viewClasses)) {
      viewClasses = viewClasses.trim().split(spaceSplitter);
    }

    if (_lodash2.default.isUndefined(viewClasses) && _lodash2.default.isNull(baseClasses)) {
      viewClasses = null;
    }

    if (_lodash2.default.isNull(viewClasses)) {
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

  if (!fromStateName) {
    _lodash2.default.each(_lodash2.default.omit(animationSettings, 'self'), function (animationSettings, toStateName) {
      animationsAssembler(toStateName, animationType, animations, stateName);
    });
  }
}