import aptivator from '../../../lib/instance';
import relations from '../../../lib/relations';
import route     from '../../../lib/route';
import vars      from '../../../lib/vars';

let {registry} = vars.states;

aptivator.state = (stateName, stateConfigs) => {
  function state() {
    let parentStateName = relations.parent(stateName);
    let parentConfigs = registry[parentStateName];
    
    if(!relations.isRoot(parentStateName) && !parentConfigs) {
      vars.states.queue.push([stateName, stateConfigs]);
      return aptivator;
    }
    
    registry[stateName] = stateConfigs;
    
    if(stateConfigs.route) {
      route.configure(parentConfigs, stateConfigs);
      vars.router.route(stateConfigs.route, stateName, (...routeValues) => {
        routeValues = routeValues.filter(value => value);
        let routeParams = route.parts.assemble(stateName, routeValues);
        aptivator.activate({stateName, routeParams});
      });
    }
  
    return vars.states.queue.length ? aptivator.state(...vars.states.queue.pop()) : aptivator;    
  }
  
  try {
    return state();
  } catch(e) {
    console.error(e);
  }
};
