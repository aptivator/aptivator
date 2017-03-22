import _         from 'lodash';
import addresser from './addresser';

import {rootStateName} from './vars';

export default {
  isRoot: stateName => stateName === rootStateName,
  
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
      family.unshift(rootStateName);
    }
    
    if(entityName.includes('@')) {
      family.push(entityName);
    }
    
    return family;
  },
  
  parent(stateName) {
    return this.family(stateName).slice(-2, -1)[0];
  },
  
  hierarchySorter(desc) {
    return (...args) => {
      let [length1, length2] = args.map(stateName => {
        if(_.isObject(stateName)) {
          ({stateName} = stateName);
        }
        return this.parts(stateName).length;
      });
      
      if(desc) {
        [length2, length1] = [length1, length2];
      }
      
      return length1 - length2;
    };
  }
};
