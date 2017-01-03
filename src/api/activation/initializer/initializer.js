import _          from 'lodash';
import error      from '../../../lib/error';
import fragment   from '../../../lib/fragment';
import route      from '../../../lib/route';
import vars       from '../../../lib/vars';
import dataStores from './lib/data-stores';

let {registry} = vars.states;

export default (callback, stateParams) => {
  let {stateName, routeParams, routeValues, silent} = stateParams;
  let stateConfigs = registry[stateName];
  let rootStateConfigs = registry[vars.rootStateName];

  function initializer() {
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
  }
  
  try {
    initializer();
    callback();
  } catch(e) {
    callback(e);
  }
};
