'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateConfigs) {
  var view = stateConfigs.view,
      stateName = stateConfigs.stateName,
      resolveConfigs = stateConfigs.resolveConfigs,
      detachHidden = stateConfigs.detachHidden;

  var uniqueAddress = _addresser2.default.uniqueAddress(stateName);

  if (!view) {
    _error2.default.throw('root state should have a designated view', 'state setter');
  }

  if (!resolveConfigs) {
    resolveConfigs = {
      duration: 0,
      store: true
    };
  }

  if (_lodash2.default.isUndefined(detachHidden)) {
    detachHidden = false;
  }

  var instance = new view();
  var record = { instance: instance };
  var configs = { root: true, uniqueAddress: uniqueAddress, detachHidden: detachHidden, resolveConfigs: resolveConfigs, record: record };

  _lodash2.default.extend(stateConfigs, configs);
  instance.render();

  stateConfigs.views = [_lodash2.default.omit(stateConfigs, 'animate')];
};