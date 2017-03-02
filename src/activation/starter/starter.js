import _                     from 'lodash';
import aptivator             from '../../lib/aptivator';
import fragment              from '../../lib/fragment';
import route_                from '../../lib/route';
import vars                  from '../../lib/vars';
import historyAdder          from '../../history/history-adder';
import defaultFlags          from './lib/default-flags';
import parallelStatesStarter from './lib/parallel-states-starter';

let {registry} = vars.states;

export default async stateParams => {
  let {stateName, name = stateName, flags = {}, route, routeValues} = stateParams;
  let {silent, parallel, transient, spliced} = flags;
  let stateConfigs = registry[name];
  
  if(!stateConfigs) {
    throw {errorType: 'undeclared', errorMessage: `state [${name}] does not exist`};
  }

  if(_.isEmpty(flags)) {
    flags = stateParams.flags = {};
  }
  
  _.extend(stateParams.flags, defaultFlags, _.clone(flags));
  
  if(parallel || transient) {
    let duplicateStateParams = aptivator.history.findOne(stateParams => {
      let {stateName, flags} = stateParams;
      let {pending, active, canceled, transient: duplicateTransient} = flags;
      let conditions = new Set();
      
      conditions.add(name === stateName);
      conditions.add(spliced && active || pending);
      conditions.add(!canceled);
      conditions.add(duplicateTransient === transient);
      
      return conditions.size === 1;
    });
    
    if(duplicateStateParams) {
      let {transientConfigs} = duplicateStateParams;
      if(transientConfigs || parallel) {
        return;
      }
      duplicateStateParams.flags.canceled = true;
    }
  }
  
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
