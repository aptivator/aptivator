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

var _detachFlagger = require('./detach-flagger');

var _detachFlagger2 = _interopRequireDefault(_detachFlagger);

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
      _this.partial({ name: viewConfigs.viewAddressUnique });
    });
  },
  partial: function partial(params) {
    var _this2 = this;

    var viewAddressUnique = _addresser2.default.uniqueAddress(params.name);
    var stateName = _addresser2.default.stateName(viewAddressUnique);
    var stateConfigs = registry[stateName];
    var viewAddresses = new Set([viewAddressUnique]);
    var activationRecord = activationRecords[viewAddressUnique];

    if (!activationRecord.active) {
      return;
    }

    if (stateConfigs.viewAddressUnique === viewAddressUnique) {
      _lodash2.default.each(stateConfigs.viewsRegistry, function (viewConfigs, viewAddressUnique) {
        if (viewConfigs.viewStateName !== stateName) {
          viewAddresses.add(viewAddressUnique);
        }
      });
    }

    var _ref = params.detach || {},
        detachFocal = _ref.focal,
        detachChildren = _ref.children,
        detachFull = _ref.full;

    viewAddresses.forEach(function (viewAddressUnique) {
      (0, _hider2.default)(viewAddressUnique, (0, _detachFlagger2.default)(detachFocal, detachFull));
    });

    var detach = { focal: detachChildren, full: detachFull };

    _lodash2.default.each(activationRecord.regions, function (regionObj) {
      regionObj.current.forEach(function (viewAddressUnique) {
        _this2.partial({ name: viewAddressUnique, detach: detach });
      });
    });
  }
};