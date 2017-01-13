'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _approximator = require('../../lib/approximator');

var _approximator2 = _interopRequireDefault(_approximator);

var _instance = require('../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

var _fragment = require('../../lib/fragment');

var _fragment2 = _interopRequireDefault(_fragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var invalidRouteHandler = function invalidRouteHandler() {
  if (_fragment2.default.toState()) {
    return;
  }

  var hash = _fragment2.default.get();
  console.log(hash);
  var stateName = _approximator2.default.fromHash(hash);
  stateName = _approximator2.default.fromStateName('error', stateName);

  if (!stateName) {
    return alert('Provided route [' + hash + '] is invalid');
  }

  _instance2.default.activate({ name: stateName, direct: { fragment: hash } });
};

exports.default = function () {
  return new Promise(function (resolve) {
    (0, _jquery2.default)(function () {
      return setTimeout(function () {
        invalidRouteHandler();
        (0, _jquery2.default)(window).on('hashchange', invalidRouteHandler);
      });
    });

    resolve();
  });
};