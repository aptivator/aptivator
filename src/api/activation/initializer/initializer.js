import _          from 'lodash';
import fragment   from '../../../lib/fragment';
import route      from '../../../lib/route';
import vars       from '../../../lib/vars';
import dataStores from './lib/data-stores';

let {registry} = vars.states;

export default (callback, stateParams) => {
  let {stateName, routeParams, routeValues, silent} = stateParams;
  let stateConfigs = registry[stateName];
  let rootStateConfigs = registry[vars.rootStateName];

  if(!stateConfigs) {
    callback(`invalid [${stateName}] state name`);
  }

  if(rootStateConfigs.showRuntime) {
    stateParams.time = Date.now();
  }

  if(!routeValues) {
    routeValues = stateConfigs.routeValues;
  }

  if(!stateConfigs.route) {
    silent = true;
  }
  
  if(!routeParams || _.isEmpty(routeParams)) {
    stateParams.routeParams = route.params.assemble(stateName, routeValues);
    
    if(!silent) {
      fragment.set(stateParams.routeParams.fragment);
    }
  }
  
  _.extend(stateParams, dataStores);
  
  callback();
};
