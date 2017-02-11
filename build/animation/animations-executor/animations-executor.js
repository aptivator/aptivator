'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var animationProperties = ['animation', 'transition'];

var animationMap = animationProperties.reduce(function (animationMap, animationProperty) {
  animationMap[animationProperty] = { eventName: animationProperty + 'end' };
  return animationMap;
}, {});

exports.default = function (animations) {
  var allPromises = [];

  _lodash2.default.each(animations, function (animationConfigs) {
    var $el = animationConfigs.$el,
        classes = animationConfigs.classes;

    var elementsPromises = [];

    _lodash2.default.each(animationMap, function (settings, animationProperty) {
      settings.initial = _lodash2.default.map($el, function (el) {
        return (0, _jquery2.default)(el).css(animationProperty);
      });
    });

    $el.addClass.apply($el, (0, _toConsumableArray3.default)(classes));

    _lodash2.default.each(animationMap, function (settings, animationProperty) {
      var animated = settings.animated,
          initial = settings.initial,
          eventName = settings.eventName;

      animated = _lodash2.default.map($el, function (el) {
        return (0, _jquery2.default)(el).css(animationProperty);
      });

      if (!_lodash2.default.isEqual(animated, initial)) {
        _lodash2.default.each($el, function (el) {
          var promise = new Promise(function (resolve) {
            return (0, _jquery2.default)(el).one(eventName, resolve);
          });
          elementsPromises.push(promise);
        });
      }
    });

    allPromises.push(Promise.all(elementsPromises).then(function () {
      return $el.removeClass.apply($el, (0, _toConsumableArray3.default)(classes));
    }));
  });

  return Promise.all(allPromises);
};