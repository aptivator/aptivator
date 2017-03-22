import relations from './relations';

import {errorRegistry, registry, transientRegistry} from './vars';

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
    let otherRegistry = stateType === 'error' ? errorRegistry : transientRegistry;
    
    if(!searchStateName) {
      return otherRegistry.root;
    }
    
    let searchStateNameParts = relations.parts(searchStateName);
    let max = 0;
    
    otherRegistry.forEach(stateName => {
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
