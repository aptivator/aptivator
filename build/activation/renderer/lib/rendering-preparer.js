'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  var instance = record.instance;

  var parentRecord = activationRecords[parentUniqueAddress];
  var parentRegions = parentRecord.regions || (parentRecord.regions = {});
  var region = parentRegions[addressSelector] || (parentRegions[addressSelector] = { current: new Set() });
  viewConfigs.rendering = { addressSelector: addressSelector, record: record, instance: instance, region: region, parentRecord: parentRecord, uniqueAddress: uniqueAddress };
};