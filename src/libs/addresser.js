import relations from './relations';
import vars      from './vars';

export default {
  region: address => address.split('@')[0],
  
  stateName: (viewAddress, containerStateName) => {
    let stateName = viewAddress.split('@')[1];
    return !containerStateName ? stateName : 
           stateName === '' ? vars.rootStateName : 
           !stateName ? relations.parent(containerStateName) : 
           stateName;
  },
  
  full(viewAddress, containerStateName) {
    return `${this.region(viewAddress)}@${this.stateName(viewAddress, containerStateName)}`;
  }
};
