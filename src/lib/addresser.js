import _ from 'lodash';

export default {
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
