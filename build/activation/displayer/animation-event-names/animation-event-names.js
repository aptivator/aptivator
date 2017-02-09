'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var animationStylesToEvents = {
  'animation': 'animationend',
  'OAnimation': 'oAnimationEnd',
  'MozAnimation': 'animationend',
  'WebkitAnimation': 'webkitAnimationEnd'
};

var transitionStylesToEvents = {
  'transition': 'transitionend',
  'OTransition': 'oTransitionEnd',
  'MozTransition': 'transitionend',
  'WebkitTransition': 'webkitTransitionEnd'
};

var stylesToEvents = [animationStylesToEvents, transitionStylesToEvents];

var el = document.createElement('someElement');

exports.default = stylesToEvents.reduce(function (eventNames, stylesToEvents) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _lodash2.default.entries(stylesToEvents)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
          styleProperty = _step$value[0],
          eventName = _step$value[1];

      if (!_lodash2.default.isUndefined(el.style[styleProperty])) {
        eventNames.push(eventName);
        break;
      }
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

  return eventNames;
}, []);