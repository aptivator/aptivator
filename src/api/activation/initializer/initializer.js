import _          from 'lodash';
import error      from '../../../lib/error';
import fragment   from '../../../lib/fragment';
import route      from '../../../lib/route';
import vars       from '../../../lib/vars';
import dataStores from './lib/data-stores';

let {registry} = vars.states;

export default stateParams => 
  new Promise(resolve => {
    stateParams.directParams = stateParams.direct;
    stateParams.routeParams = stateParams.route;
    
    delete stateParams.direct;
    delete stateParams.route;
    
    let {stateName, routeParams, routeValues, silent} = stateParams;
    let stateConfigs = registry[stateName];
    let rootStateConfigs = registry[vars.rootStateName];
    
    if(rootStateConfigs.showRuntime) {
      stateParams.time = Date.now();
    }
  
    if(!stateConfigs) {
      error.throw(`invalid [${stateName}] state name`, 'initializer');
    }
  
    if(!routeValues) {
      routeValues = stateConfigs.routeValues;
    }
  
    if(!stateConfigs.route) {
      silent = true;
    }
    
    if(!routeParams || _.isEmpty(routeParams)) {
      stateParams.routeParams = route.parts.assemble(stateName, routeValues);
      
      if(!silent) {
        fragment.set(stateParams.routeParams.fragment);
      }
    }
    
    _.extend(stateParams, dataStores);
    
    resolve(stateParams);
  });
