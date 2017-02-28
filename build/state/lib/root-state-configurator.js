'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var activationRecords = _vars2.default.states.activationRecords;

exports.default = function (stateConfigs) {
  var view = stateConfigs.view,
      stateName = stateConfigs.stateName,
      resolveConfigs = stateConfigs.resolveConfigs,
      detachHidden = stateConfigs.detachHidden;

  var uniqueAddress = _addresser2.default.uniqueAddress(stateName);

  if (!view) {
    _error2.default.throw('root state should have a designated view', 'state setter');
  }

  var instance = new view();
  instance.render();
  activationRecords[uniqueAddress] = { instance: instance, active: true };

  if (!resolveConfigs) {
    resolveConfigs = {
      duration: 0,
      store: true
    };
  }

  if (_lodash2.default.isUndefined(detachHidden)) {
    detachHidden = false;
  }

  var configs = { root: true, uniqueAddress: uniqueAddress, viewsRegistry: (0, _defineProperty3.default)({}, uniqueAddress, {}), detachHidden: detachHidden, resolveConfigs: resolveConfigs };
  _lodash2.default.extend(stateConfigs, configs);
};