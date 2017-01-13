import _         from 'lodash';
import relations from './relations';
import vars      from './vars';

let {states} = vars;
let {registry} = states;

export default {
  fromHash(hash) {
    if(!hash) {
      return;
    }
    
    for(let stateName in registry) {
      let stateConfigs = registry[stateName];
      
      if(!stateConfigs.route) {
        continue;
      }
      
      if(stateConfigs.routeRx.test(hash)) {
        return stateName;
      }
    }
    
    return this.fromHash(hash.split('/').slice(0, -1).join('/'));
  },
  
  fromStateName(stateType, searchStateName) {
    if(!searchStateName) {
      return states[stateType].root;
    }
    
    let searchStateNameParts = relations.parts(searchStateName);
    let max = 0;
    
    states[stateType].forEach(stateName => {
      let intersection = _.intersection(searchStateNameParts, relations.parts(stateName));
      if(intersection.length > max) {
        searchStateName = stateName;
        max = intersection.length;
      }
    });
    
    return max ? searchStateName : this.fromStateName(stateType);
  }
};
