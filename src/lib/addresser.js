import _    from 'lodash';
import vars from './vars';

let {registry} = vars.states;

export default {
  isStateAddress(address) {
    if(!address.includes('@')) {
      return true;
    }
    
    let stateName = this.stateName(address);
    return registry[stateName].uniqueAddress === address;
  },
  
  uniqueAddress(stateName) {
    return `${_.uniqueId('aptivator-id-')}@${stateName}`;
  },
  
  parts: address => address.split('@'),

  region(address) {
    return this.parts(address)[0];
  },
  
  stateName(address) {
    return address.includes('@') ? this.parts(address)[1] : address;
  }
};
