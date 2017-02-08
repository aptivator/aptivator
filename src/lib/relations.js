import _         from 'lodash';
import addresser from './addresser';
import vars      from './vars';

export default {
  isRoot: stateName => stateName === vars.rootStateName,
  
  parts(stateName) {
    return stateName.split('.');
  },
  
  family(entityName) {
    if(!entityName) { 
      return []; 
    }
    
    let stateName = addresser.stateName(entityName);
    
    let family = this.parts(stateName);
    
    family = _.range(1, family.length + 1).map(end => family.slice(0, end).join('.'));
    
    if(!this.isRoot(stateName)) {
      family.unshift(vars.rootStateName);
    }
    
    if(entityName.includes('@')) {
      family.push(entityName);
    }
    
    return family;
  },
  
  parent(stateName) {
    return this.family(stateName).slice(-2, -1)[0];
  }
};
