import vars from './vars';

export default {
  uniqueStateAddress(stateName) {
    return vars.states.registry[stateName].viewAddressUnique;
  },
  
  parts: address => address.split('@'),

  region(viewAddress) {
    return this.parts(viewAddress)[0];
  },
  
  stateName(viewAddress) {
    return this.parts(viewAddress)[1];
  }
};
