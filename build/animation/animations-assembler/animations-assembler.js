'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spaceSplitter = _vars2.default.spaceSplitter,
    states = _vars2.default.states;
var activationRecords = states.activationRecords,
    registry = states.registry;

exports.default = function (statesParams, animationType) {
  return statesParams.reduce(function (animations, stateParams) {
    var animate = registry[stateParams.stateName].animate;

    var _ref = animate || {},
        animationsMap = _ref[animationType];

    _lodash2.default.each(animationsMap, function (classNames, entityName) {
      var _classes;

      var stateName = _addresser2.default.stateName(entityName);
      var stateConfigs = registry[stateName];

      var _ref2 = stateConfigs || {},
          viewAddressUnique = _ref2.viewAddressUnique;

      var activationRecord = activationRecords[viewAddressUnique] || {};

      var _ref3 = activationRecord.instance || {},
          $el = _ref3.$el;

      var selector = entityName.includes('@') && _addresser2.default.region(entityName);

      if (!stateConfigs) {
        return _error2.default.warn('state [' + stateName + '] does not exist', 'animator');
      }

      if (!activationRecord.active) {
        return _error2.default.warn('state [' + stateName + '] is not activated', 'animator');
      }

      if (selector && !($el = $el.find(selector)).size()) {
        return _error2.default.warn('no elements were found using [' + selector + '] selector', 'animator');
      }

      var stateAnimations = animations[entityName] || (animations[entityName] = {});
      var classes = stateAnimations.classes;


      if (!classes) {
        classes = new Set();
        _lodash2.default.extend(stateAnimations, { $el: $el, classes: classes });
      }

      (_classes = classes).add.apply(_classes, (0, _toConsumableArray3.default)(classNames.trim().split(spaceSplitter)));
    });

    return animations;
  }, {});
};