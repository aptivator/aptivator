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

var _stylesAggregator = require('./styles-aggregator/styles-aggregator');

var _stylesAggregator2 = _interopRequireDefault(_stylesAggregator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (animations) {
  var allPromises = [];

  _lodash2.default.each(animations, function (animationConfigs) {
    var $el = animationConfigs.$el,
        classes = animationConfigs.classes;

    var elementsPromises = [];

    _lodash2.default.each($el, function (el) {
      var $el = (0, _jquery2.default)(el);
      var css = ['animation', 'transition'].reduce(function (css, property) {
        css[property] = (0, _stylesAggregator2.default)(el, property);
        return css;
      }, {});

      $el.addClass.apply($el, (0, _toConsumableArray3.default)(classes));

      _lodash2.default.each(css, function (css, property) {
        if (css !== (0, _stylesAggregator2.default)(el, property)) {
          var promise = new Promise(function (resolve) {
            return $el.one(property + 'end', resolve);
          });
          elementsPromises.push(promise);
        }
      });
    });

    allPromises.push(Promise.all(elementsPromises).then(function () {
      return $el.removeClass.apply($el, (0, _toConsumableArray3.default)(classes));
    }));
  });

  return Promise.all(allPromises);
};