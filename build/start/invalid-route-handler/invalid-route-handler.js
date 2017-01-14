'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _invalidRouteHandler = require('./lib/invalid-route-handler');

var _invalidRouteHandler2 = _interopRequireDefault(_invalidRouteHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  return new Promise(function (resolve) {
    (0, _jquery2.default)(function () {
      return setTimeout(function () {
        (0, _invalidRouteHandler2.default)();
        (0, _jquery2.default)(window).on('hashchange', _invalidRouteHandler2.default);
      });
    });

    resolve();
  });
};