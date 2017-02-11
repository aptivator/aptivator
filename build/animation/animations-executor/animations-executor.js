'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

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
      settings.initial = _lodash2.default.reduce($el, function (initial, el) {
        var $el = (0, _jquery2.default)(el);
        var initialCss = $el.css(animationProperty);
        initial.set($el, initialCss);
        return initial;
      }, new Map());
    });

    $el.addClass.apply($el, (0, _toConsumableArray3.default)(classes));

    _lodash2.default.each(animationMap, function (settings, animationProperty) {
      var eventName = settings.eventName,
          initial = settings.initial;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
              $el = _step$value[0],
              initialCss = _step$value[1];

          if (initialCss !== $el.css(animationProperty)) {
            var promise = new Promise(function (resolve) {
              return $el.one(eventName, resolve);
            });
            elementsPromises.push(promise);
          }
        };

        for (var _iterator = initial.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
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
    });

    allPromises.push(Promise.all(elementsPromises).then(function () {
      return $el.removeClass.apply($el, (0, _toConsumableArray3.default)(classes));
    }));
  });

  return Promise.all(allPromises);
};