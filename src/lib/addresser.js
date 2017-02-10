import vars    from './vars';

let {registry} = vars.states;

export default {
  uniqueAddress(entityName) {
    let hasAt = entityName.includes('@');
    return hasAt ? entityName : registry[entityName].viewAddressUnique;
  },
  
  parts: address => address.split('@'),

  region(viewAddress) {
    return this.parts(viewAddress)[0];
  },
  
  stateName(viewAddress) {
    return viewAddress.includes('@') ? this.parts(viewAddress)[1] : viewAddress;
  }
};
