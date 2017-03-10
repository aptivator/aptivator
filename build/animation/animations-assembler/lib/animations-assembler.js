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

var _params2 = require('../../../lib/params');

var _params3 = _interopRequireDefault(_params2);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _elementAssembler = require('./element-assembler');

var _elementAssembler2 = _interopRequireDefault(_elementAssembler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spaceSplitter = _vars2.default.spaceSplitter,
    states = _vars2.default.states;
var activationRecords = states.activationRecords,
    activationSequences = states.activationSequences,
    registry = states.registry;
function animationsAssembler(stateName, stateParams, animationType, animations, fromStateName) {
  var _registry$stateName = registry[stateName],
      _registry$stateName$a = _registry$stateName.animate,
      animate = _registry$stateName$a === undefined ? {} : _registry$stateName$a,
      uniqueAddress = _registry$stateName.uniqueAddress;
  var _animate$animationTyp = animate[animationType],
      animationSettings = _animate$animationTyp === undefined ? {} : _animate$animationTyp;
  var _activationRecords$un = activationRecords[uniqueAddress],
      active = _activationRecords$un.active,
      _activationRecords$un2 = _activationRecords$un.instance,
      instance = _activationRecords$un2 === undefined ? {} : _activationRecords$un2;
  var $el = instance.$el;

  var stateNameToUse = stateName;

  if (!_lodash2.default.isPlainObject(animationSettings)) {
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


  if (!_lodash2.default.isPlainObject(self_)) {
    self_ = { base: self_ };
  }

  var _self_ = self_,
      base = _self_.base;


  if (!_lodash2.default.isPlainObject(base)) {
    base = { classes: base };
  }

  var _base = base,
      baseClasses = _base.classes,
      baseAdd = _base.add,
      baseRemove = _base.remove;


  if (_lodash2.default.isFunction(baseClasses)) {
    var params = _params3.default.assemble(stateName, stateParams);
    baseClasses = baseClasses(params);
  }

  if (_lodash2.default.isString(baseClasses)) {
    baseClasses = baseClasses.trim().split(spaceSplitter);
  }

  if ($el) {
    _lodash2.default.each(self_.elements, function (selectorConfigs, selector) {
      (0, _elementAssembler2.default)({ selector: selector, selectorConfigs: selectorConfigs, stateName: stateName, stateParams: stateParams, $el: $el, animations: animations });
    });
  }

  _lodash2.default.each(activationSequences[stateName], function (viewConfigs) {
    var uniqueAddress = viewConfigs.uniqueAddress,
        viewHash = viewConfigs.viewHash,
        animate = viewConfigs.animate,
        addressStateName = viewConfigs.addressStateName;

    var _ref2 = activationRecords[uniqueAddress].instance || {},
        $el = _ref2.$el;

    if (!$el) {
      return;
    }

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

    if (!_lodash2.default.isPlainObject(animate)) {
      animate = (0, _defineProperty3.default)({}, animationType, animate);
    }

    var _ref3 = animate || {};

    animate = _ref3[animationType];


    if (fromStateName || _lodash2.default.isUndefined(animate)) {
      animate = self_[viewHash];
    }

    if (!_lodash2.default.isPlainObject(animate)) {
      animate = { classes: animate };
    }

    var _animate2 = animate,
        viewClasses = _animate2.classes,
        add = _animate2.add,
        remove = _animate2.remove,
        elements = _animate2.elements;


    if (_lodash2.default.isFunction(viewClasses)) {
      var _params = _params3.default.assemble(uniqueAddress, stateParams);
      viewClasses = viewClasses(_params);
    }

    _lodash2.default.each(elements, function (selectorConfigs, selector) {
      (0, _elementAssembler2.default)({ selector: selector, selectorConfigs: selectorConfigs, uniqueAddress: uniqueAddress, stateParams: stateParams, $el: $el, animations: animations });
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
      animationsAssembler(toStateName, stateParams, animationType, animations, stateName);
    });
  }
}