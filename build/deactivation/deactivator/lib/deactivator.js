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
    var name = params.name;

    var stateName = _addresser2.default.stateName(name);
    var activationSequence = activationSequences[stateName];

    _lodash2.default.each(activationSequence, function (viewConfigs) {
      (0, _hider2.default)(viewConfigs.viewAddressUnique);
    });
  },
  partial: function partial(params) {
    var _this = this;

    var name = params.name,
        detach = params.detach;

    var hasAt = name.includes('@');
    var stateName = _addresser2.default.stateName(name);
    var viewAddressUnique = hasAt ? name : _addresser2.default.uniqueStateAddress(name);

    var _ref = detach || {},
        detachFocal = _ref.focal,
        detachChildren = _ref.children,
        detachFull = _ref.full;

    var stateConfigs = registry[stateName];
    var viewAddresses = new Set([viewAddressUnique]);

    if (stateConfigs.viewAddressUnique === viewAddressUnique) {
      _lodash2.default.each(stateConfigs.viewsRegistry, function (viewConfigs, viewAddressUnique) {
        if (viewConfigs.viewStateName !== stateName) {
          viewAddresses.add(viewAddressUnique);
        }
      });
    }

    viewAddresses.forEach(function (viewAddressUnique) {
      (0, _hider2.default)(viewAddressUnique, (0, _detachFlagger2.default)(detachFocal, detachFull));
    });

    _lodash2.default.each(activationRecords[viewAddressUnique].regions, function (regionObj) {
      regionObj.current.forEach(function (viewAddressUnique) {
        var detach = { focal: detachChildren, full: detachFull };
        _this.partial({ name: viewAddressUnique, detach: detach });
      });
    });
  }
};