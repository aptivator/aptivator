'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _stylesAggregator = require('./styles-aggregator/styles-aggregator');

var _stylesAggregator2 = _interopRequireDefault(_stylesAggregator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (animations) {
  var allPromises = [];
  var activatedClasses = [];

  _lodash2.default.each(animations, function (views) {
    _lodash2.default.each(views, function (animationConfigs, viewHash) {
      var $el = animationConfigs.$el,
          classes = animationConfigs.classes;

      var elementsPromises = [];
      classes = classes.join(' ');

      _lodash2.default.each($el, function (el) {
        var $el = (0, _jquery2.default)(el);
        var css = ['animation', 'transition'].reduce(function (css, property) {
          css[property] = (0, _stylesAggregator2.default)(el, property);
          return css;
        }, {});

        $el.addClass(classes);
        activatedClasses.push([$el, classes]);

        _lodash2.default.each(css, function (css, property) {
          if (css !== (0, _stylesAggregator2.default)(el, property)) {
            var promise = new Promise(function (resolve) {
              return $el.one(property + 'end', resolve);
            });
            elementsPromises.push(promise);
          }
        });
      });

      allPromises.push(Promise.all(elementsPromises));
    });
  });

  return Promise.all(allPromises).then(function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = activatedClasses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
            $el = _step$value[0],
            classes = _step$value[1];

        $el.removeClass(classes);
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
};