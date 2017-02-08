'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instance = require('../../../lib/instance');

var _instance2 = _interopRequireDefault(_instance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var activeStateParams = _instance2.default.history.getOne(function (stateParams) {
    var _stateParams$flags = stateParams.flags,
        active = _stateParams$flags.active,
        parallel = _stateParams$flags.parallel,
        transient = _stateParams$flags.transient;

    if (active && !parallel && !transient) {
      return true;
    }
  });

  if (activeStateParams) {
    _instance2.default.deactivate({ name: activeStateParams.stateName, stateParams: activeStateParams });
  }
};