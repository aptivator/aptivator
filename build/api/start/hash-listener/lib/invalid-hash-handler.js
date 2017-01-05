'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _fragment = require('../../../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var running = false;

var invalidRouteListener = function invalidRouteListener(evt) {
  if (running) {
    return;
  }

  if (_fragment2.default.toState()) {
    console.log('valid route', _fragment2.default.get());
    return;
  }

  console.log('invalid route: ' + _fragment2.default.get());

  running = false;
};

exports.default = function () {
  (0, _jquery2.default)(function () {
    invalidRouteListener();
    setTimeout(function () {
      return (0, _jquery2.default)(window).on('hashchange', invalidRouteListener);
    });
  });
};