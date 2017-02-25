'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _vars = require('../../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _vars$states = _vars2.default.states,
    activationRecords = _vars$states.activationRecords,
    registry = _vars$states.registry;

exports.default = function (viewConfigs) {
  var uniqueAddress = viewConfigs.uniqueAddress,
      addressSelector = viewConfigs.addressSelector,
      addressStateName = viewConfigs.addressStateName;
  var parentUniqueAddress = registry[addressStateName].uniqueAddress;

  var record = activationRecords[uniqueAddress] = {};
  var parentRecord = activationRecords[parentUniqueAddress];
  var parentRegions = parentRecord.regions || (parentRecord.regions = {});
  var region = parentRegions[addressSelector] || (parentRegions[addressSelector] = { current: new Set() });
  _lodash2.default.extend(viewConfigs, { record: record, region: region, parentRecord: parentRecord });
};