import _    from 'lodash';

import {registry} from './vars';

export default {
  uniqueAddress(stateName) {
    return `${_.uniqueId('aptivator-id-')}@${stateName}`;
  },
  
  parts: address => address.split('@'),

  region(address) {
    return this.parts(address)[0];
  },
  
  stateName(address) {
    return address.includes('@') ? this.parts(address)[1] : address;
  },
  
  record(address) {
    let stateName = this.stateName(address);
    let {views} = registry[stateName];
    return _.filter(views, {uniqueAddress: address})[0].record;
  }
};
