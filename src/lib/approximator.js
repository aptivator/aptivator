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
      let {route} = stateConfigs;
      
      if(!route) {
        continue;
      }
      
      if(route.rx.test(hash)) {
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
      let stateNameParts = relations.parts(stateName);
      
      if(stateNameParts.length > searchStateNameParts.length) {
        return;
      }
      
      for(var i = 0, l = stateNameParts.length; i < l; i++) {
        if(stateNameParts[i] !== searchStateNameParts[i]) {
          break;
        }
      }
      
      if(i > max) {
        searchStateName = stateName;
        max = i;
      }
    });
    
    return max ? searchStateName : this.fromStateName(stateType);
  }
};
