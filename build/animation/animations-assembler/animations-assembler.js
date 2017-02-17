'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spaceSplitter = _vars2.default.spaceSplitter,
    states = _vars2.default.states,
    rootStateName = _vars2.default.rootStateName;
var activationRecords = states.activationRecords,
    registry = states.registry;


var stateNamesNormalizer = function stateNamesNormalizer(stateNames) {
  stateNames = _lodash2.default.reduce(stateNames, function (stateNames, stateName) {
    var family = _relations2.default.family(stateName);
    stateNames.push.apply(stateNames, (0, _toConsumableArray3.default)(family));
    return stateNames;
  }, []);

  stateNames = _lodash2.default.uniq(stateNames);
  stateNames = _lodash2.default.difference(stateNames, [rootStateName]);
  stateNames.sort(_relations2.default.hierarchySorter()).unshift(rootStateName);
  return stateNames;
};

var processState = function processState(stateName, settings, animationType, animations, origin) {
  var viewsRegistry = registry[stateName].viewsRegistry;


  if (!_lodash2.default.isObject(settings)) {
    settings = { self: settings };
  }

  var _settings = settings,
      self_ = _settings.self;


  if (!_lodash2.default.isObject(self_)) {
    self_ = { classes: self_ };
  }

  var _self_ = self_,
      selfClasses = _self_.classes,
      selfAdd = _self_.add,
      selfRemove = _self_.remove;


  if (selfAdd && selfRemove) {
    _error2.default.throw('for [' + stateName + '] animations, specify either \'add\' or \'remove\' flag', 'animator');
  }

  if (_lodash2.default.isString(selfClasses)) {
    selfClasses = selfClasses.trim().split(spaceSplitter);
  }

  _lodash2.default.each(viewsRegistry, function (viewConfigs, viewAddressUnique) {
    var _ref = activationRecords[viewAddressUnique] || {},
        active = _ref.active,
        instance = _ref.instance;

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
      if (selfClasses === false) {
        _lodash2.default.remove(classes, function () {
          return true;
        });
      } else if (selfClasses) {
        if (selfAdd) {
          classes.push.apply(classes, (0, _toConsumableArray3.default)(selfClasses));
        } else if (selfRemove) {
          _lodash2.default.remove(classes, function (clss) {
            return selfClasses.includes(clss);
          });
        } else {
          classes.splice.apply(classes, [0, classes.length].concat((0, _toConsumableArray3.default)(selfClasses)));
        }
      }
    }

    var _ref2 = animate || {};

    animate = _ref2[animationType];


    if (!origin || _lodash2.default.isUndefined(animate)) {
      animate = settings[viewHash];
    }

    if (!_lodash2.default.isObject(animate)) {
      animate = { classes: animate };
    }

    var _animate = animate,
        viewClasses = _animate.classes,
        add = _animate.add,
        remove = _animate.remove;


    if (_lodash2.default.isString(viewClasses)) {
      viewClasses = viewClasses.trim().split(spaceSplitter);
    }

    if (add && remove) {
      _error2.default.throw('for [' + viewHash + '] view animations, in [' + stateName + '], specify either \'add\' or \'remove\' flag', 'animator');
    }

    if (_lodash2.default.isUndefined(viewClasses) && selfClasses === false || viewClasses === false) {
      return delete animations[stateName][viewHash];
    }

    if (_lodash2.default.isUndefined(viewClasses)) {
      return;
    }

    if (add) {
      classes.push.apply(classes, (0, _toConsumableArray3.default)(viewClasses));
    } else if (remove) {
      _lodash2.default.remove(classes, function (clss) {
        return viewClasses.includes(clss);
      });
    } else {
      classes.splice.apply(classes, [0, classes.length].concat((0, _toConsumableArray3.default)(viewClasses)));
    }
  });
};

var processSelector = function processSelector() {};

var animationsAssembler = function animationsAssembler(stateName, animationType, animations) {
  var animate = registry[stateName].animate;

  var _ref3 = animate || {},
      _ref3$animationType = _ref3[animationType],
      typeSettings = _ref3$animationType === undefined ? {} : _ref3$animationType;

  if (!_lodash2.default.isObject(typeSettings)) {
    typeSettings = { self: typeSettings };
  }

  _lodash2.default.each(typeSettings, function (entitySettings, entityName) {
    if (entityName.includes('@')) {
      return processSelector(entityName, entitySettings, animations);
    }

    if (entityName === 'self') {
      entityName = stateName;
    }

    var origin = stateName === entityName;

    processState(entityName, entitySettings, animationType, animations, origin);
  });

  return animations;
};

exports.default = function (stateNames, animationType) {
  stateNames = stateNamesNormalizer(stateNames);

  return _lodash2.default.reduce(stateNames, function (animations, stateName) {
    return animationsAssembler(stateName, animationType, animations);
  }, {});
};