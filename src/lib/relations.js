import _    from 'lodash';
import vars from './vars';

export default {
  isRoot: stateName => stateName === vars.rootStateName,
  
  parts(stateName) {
    return stateName.split('.');
  },
  
  family(stateName) {
    if(!stateName) { 
      return []; 
    }
    
    let family = this.parts(stateName);
    
    family = _.range(1, family.length + 1).map(end => family.slice(0, end).join('.'));
    
    if(!this.isRoot(stateName)) {
      family.unshift(vars.rootStateName);
    }
    
    return family;
  },
  
  parent(stateName) {
    return this.family(stateName).slice(-2, -1)[0];
  }
};