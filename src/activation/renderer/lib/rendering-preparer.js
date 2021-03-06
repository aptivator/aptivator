import _         from 'lodash';
import addresser from '../../../lib/addresser';

import {registry} from '../../../lib/vars';

export default viewConfigs => {
  let {addressSelector, addressStateName} = viewConfigs;
  let {uniqueAddress: parentUniqueAddress} = registry[addressStateName];
  let parentRecord = addresser.record(parentUniqueAddress);
  let parentRegions = parentRecord.regions || (parentRecord.regions = {});
  let region = parentRegions[addressSelector] || (parentRegions[addressSelector] = {current: new Set()});
  _.extend(viewConfigs, {record: {}, region, parentRecord});
};
