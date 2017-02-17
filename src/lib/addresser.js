import _    from 'lodash';
import vars from './vars';

let {registry} = vars.states;

export default {
  isStateAddress(viewAddress) {
    if(!viewAddress.includes('@')) {
      return true;
    }
    
    let stateName = this.stateName(viewAddress);
    return registry[stateName].viewAddressUnique === viewAddress;
  },
  
  uniqueAddress(stateName) {
    return `${_.uniqueId('aptivator-id-')}@${stateName}`;
  },
  
  parts: address => address.split('@'),

  region(viewAddress) {
    return this.parts(viewAddress)[0];
  },
  
  stateName(viewAddress) {
    return viewAddress.includes('@') ? this.parts(viewAddress)[1] : viewAddress;
  }
};
