'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _addresser = require('../../../lib/addresser');

var _addresser2 = _interopRequireDefault(_addresser);

var _displayer = require('../../../lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _detachFlagger = require('./detach-flagger');

var _detachFlagger2 = _interopRequireDefault(_detachFlagger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    activationRecords = _vars$states.activationRecords,
    activationSequences = _vars$states.activationSequences;
exports.default = {
  full: function full(params) {
    var name = params.name;

    var hasAt = name.includes('@');
    var stateName = hasAt ? _addresser2.default.stateName(name) : name;
    var activationSequence = activationSequences[stateName];

    _lodash2.default.each(activationSequence, function (viewConfigs) {
      _displayer2.default.hide(viewConfigs.viewAddressUnique);
    });
  },
  partial: function partial(params) {
    var _this = this;

    var name = params.name,
        detach = params.detach,
        focal = params.focal;

    var hasAt = name.includes('@');
    var viewAddressUnique = hasAt ? name : _addresser2.default.uniqueStateAddress(name);

    var _ref = detach || {},
        detachFocal = _ref.focal,
        detachChildren = _ref.children,
        detachFull = _ref.full;

    _displayer2.default.hide(viewAddressUnique, (0, _detachFlagger2.default)(detachFocal, detachFull));

    _lodash2.default.each(activationRecords[viewAddressUnique].regions, function (regionObj) {
      regionObj.current.forEach(function (viewAddressUnique) {
        if (focal) {
          return _displayer2.default.hide(viewAddressUnique, (0, _detachFlagger2.default)(detachChildren, detachFull));
        }

        var detach = { focal: detachChildren, full: detachFull };

        _this.partial({ name: viewAddressUnique, detach: detach, focal: focal });
      });
    });
  }
};