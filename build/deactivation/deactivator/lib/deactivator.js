'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _hider = require('./hider');

var _hider2 = _interopRequireDefault(_hider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    activationRecords = _vars$states.activationRecords,
    activationSequences = _vars$states.activationSequences,
    registry = _vars$states.registry;
exports.default = {
  full: function full(params) {
    var _this = this;

    var stateName = _addresser2.default.stateName(params.name);
    var activationSequence = activationSequences[stateName];

    _lodash2.default.each(activationSequence, function (viewConfigs) {
      _this.partial({ name: viewConfigs.uniqueAddress });
    });
  },
  partial: function partial(params) {
    var _this2 = this;

    var name = params.name,
        _params$detach = params.detach,
        detach = _params$detach === undefined ? {} : _params$detach;

    var uniqueAddress = name.includes('@') ? name : registry[name].uniqueAddress;
    var stateName = _addresser2.default.stateName(uniqueAddress);
    var stateConfigs = registry[stateName];
    var activationRecord = activationRecords[uniqueAddress] || {};

    if (!activationRecord.active && !detach.focal) {
      return;
    }

    var _detach = detach,
        detachFocal = _detach.focal,
        detachChildren = _detach.children,
        detachFull = _detach.full;

    detach = _lodash2.default.isUndefined(detachFocal) && detachFull || detachFocal;

    if (stateConfigs.uniqueAddress === uniqueAddress) {
      _lodash2.default.each(stateConfigs.views, function (viewConfigs) {
        var uniqueAddress = viewConfigs.uniqueAddress,
            viewStateName = viewConfigs.stateName;

        if (viewStateName === stateName) {
          (0, _hider2.default)(uniqueAddress, detach);
        }
      });
    }

    detach = { focal: detachChildren, full: detachFull };

    _lodash2.default.each(activationRecord.regions, function (regionObj) {
      regionObj.current.forEach(function (uniqueAddress) {
        _this2.partial({ name: uniqueAddress, detach: _lodash2.default.clone(detach) });
      });
    });
  }
};