import _                     from 'lodash';
import fragment              from '../../lib/fragment';
import route_                from '../../lib/route';
import vars                  from '../../lib/vars';
import historyAdder          from '../../history/history-adder';
import defaultFlags          from './lib/default-flags';
import parallelStatesStarter from './lib/parallel-states-starter';

let {activating, states} = vars;
let {registry} = states;

export default async stateParams => {
  let {stateName, name = stateName, flags = {}, route, routeValues} = stateParams;
  let {silent, parallel, transient} = flags;
  let stateConfigs = registry[name];
  let tracker = activating[transient ? 'transient' : 'regular'];
  
  if(!stateConfigs) {
    throw {errorType: 'undeclared', errorMessage: `state [${name}] does not exist`};
  }
  
  if((parallel || transient) && tracker.includes(name)) {
    if(_.isObject(stateParams)) {
      stateParams.flags.canceled = true;
    }
    
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
  
  parallelStatesStarter(stateParams);
  
  historyAdder(stateParams);
  
  return stateParams;
};
