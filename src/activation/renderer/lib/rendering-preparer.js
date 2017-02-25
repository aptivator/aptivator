import _    from 'lodash';
import vars from '../../../lib/vars';

let {activationRecords, registry} = vars.states;

export default viewConfigs => {
  let {uniqueAddress, addressSelector, addressStateName} = viewConfigs;
  let {uniqueAddress: parentUniqueAddress} = registry[addressStateName];
  let record = activationRecords[uniqueAddress] = {};
  let parentRecord = activationRecords[parentUniqueAddress];
  let parentRegions = parentRecord.regions || (parentRecord.regions = {});
  let region = parentRegions[addressSelector] || (parentRegions[addressSelector] = {current: new Set()});
  _.extend(viewConfigs, {record, region, parentRecord});
};
