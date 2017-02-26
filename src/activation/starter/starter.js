import _                     from 'lodash';
import aptivator             from '../../lib/instance';
import vars                  from '../../lib/vars';
import fragment              from '../../lib/fragment';
import historyAdder          from '../../history/history-adder';
import route_                from '../../lib/route';
import defaultFlags          from './lib/default-flags';
import parallelStatesStarter from './lib/parallel-states-starter';

let {registry} = vars.states;

export default async stateParams => {
  let {stateName, name = stateName, flags = {}, route, routeValues} = stateParams;
  let {silent, parallel} = flags;
  let stateConfigs = registry[name];
  
  if(!stateConfigs) {
    throw {errorType: 'undeclared', errorMessage: `state [${name}] does not exist`};
  }
  
  if(_.isEmpty(flags)) {
    flags = stateParams.flags = {};
  }
  
  _.extend(stateParams.flags, defaultFlags, _.clone(flags));
  
  if(!stateName) {
    stateParams.stateName = name;
    delete stateParams.name;
  }
  
  if(stateConfigs.route && !route) {
    if(!routeValues) {
      routeValues = stateConfigs.routeValues;
    }
    
    route = route_.parts.assemble(name, routeValues);
    
    if(!(silent || parallel)) {
      fragment.set(route.fragment);
    }
    
    _.extend(stateParams, {route});
  }
  
  parallelStatesStarter(name, stateParams);
  
  historyAdder(stateParams);
  
  return stateParams;
};
