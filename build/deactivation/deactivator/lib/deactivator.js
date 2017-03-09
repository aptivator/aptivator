'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _hider = require('./hider');

var _hider2 = _interopRequireDefault(_hider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    activationRecords = _vars$states.activationRecords,
    activationSequences = _vars$states.activationSequences;
exports.default = {
  full: function full(params) {
    var _this = this;

    var stateName = _addresser2.default.stateName(params.name);
    var family = _relations2.default.family(stateName).slice(1);
    _lodash2.default.each(family, function (stateName) {
      _this.partial({ name: stateName });
    });
  },
  partial: function partial(params) {
    var _this2 = this;

    var stateName = _addresser2.default.stateName(params.name);
    _lodash2.default.each(activationSequences[stateName], function (viewConfigs) {
      _this2.focal({ name: viewConfigs.uniqueAddress });
    });
  },
  focal: function focal(params) {
    var _this3 = this;

    var name = params.name,
        _params$detach = params.detach,
        detach = _params$detach === undefined ? {} : _params$detach;

    var activationRecord = activationRecords[name];
    var _detach = detach,
        detachFocal = _detach.focal,
        detachChildren = _detach.children,
        detachFull = _detach.full;

    detach = _lodash2.default.isUndefined(detachFocal) && detachFull || detachFocal;

    (0, _hider2.default)(activationRecord, detach);

    detach = { focal: detachChildren, full: detachFull };

    _lodash2.default.each(activationRecord.regions, function (regionObj) {
      regionObj.current.forEach(function (uniqueAddress) {
        _this3.focal({ name: uniqueAddress, detach: _lodash2.default.clone(detach) });
      });
    });
  }
};