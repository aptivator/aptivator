import _                     from 'lodash';
import fragment              from '../../lib/fragment';
import routeAssembler        from '../../lib/route/route-assembler';
import historyAdder          from '../../history/history-adder';
import defaultFlags          from './lib/default-flags';
import parallelStatesStarter from './lib/parallel-states-starter';

import {activatingRegulars, activatingTransients, registry} from '../../lib/vars';

export default async stateParams => {
  let {stateName, name = stateName, flags = {}, route, routeValues} = stateParams;
  let {silent, parallel, transient} = flags;
  let stateConfigs = registry[name];
  let tracker = transient ? activatingTransients : activatingRegulars;
  
  if(!stateConfigs) {
    throw {type: 'undeclared', message: `state [${name}] does not exist`};
  }

  if((parallel || transient) && tracker.includes(name)) {
    return;
  }
  
  tracker.push(name);

  if(_.isEmpty(flags)) {
    flags = stateParams.flags = {};
  }
  
  _.extend(stateParams.flags, defaultFlags, _.clone(flags));
  
  if(!stateName) {
    stateParams.stateName = name;
    delete stateParams.name;
  }
  
  let {route: routeConfigs} = stateConfigs;
  
  if(!_.isEmpty(routeConfigs) && !route) {
    let {values} = routeConfigs;
    
    if(!routeValues) {
      routeValues = values;
    }
    
    route = routeAssembler(name, routeValues);
    
    if(!(silent || parallel)) {
      fragment.set(route.fragment);
    }
    
    _.extend(stateParams, {route});
  }
  
  parallelStatesStarter(stateParams);
  
  historyAdder(stateParams);
  
  return stateParams;
};
