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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

exports.default = function (viewConfigs) {
  var addressSelector = viewConfigs.addressSelector,
      addressStateName = viewConfigs.addressStateName;
  var parentUniqueAddress = registry[addressStateName].uniqueAddress;

  var parentRecord = _addresser2.default.record(parentUniqueAddress);
  var parentRegions = parentRecord.regions || (parentRecord.regions = {});
  var region = parentRegions[addressSelector] || (parentRegions[addressSelector] = { current: new Set() });
  _lodash2.default.extend(viewConfigs, { record: {}, region: region, parentRecord: parentRecord });
};