import aptivator from '../../../lib/instance';
import relations from '../../../lib/relations';
import route     from '../../../lib/route';
import vars      from '../../../lib/vars';

let {registry} = vars.states;

aptivator.state = (stateName, stateConfigs) => {
  let parentStateName = relations.parent(stateName);
  let parentConfigs = registry[parentStateName];
  
  if(!relations.isRoot(parentStateName) && !parentConfigs) {
    vars.states.queue.push([stateName, stateConfigs]);
    return aptivator;
  }
  
  registry[stateName] = stateConfigs;
  
  if(stateConfigs.route) {
    stateConfigs.route = route.make(parentConfigs.route, stateConfigs.route);
    
    if(!stateConfigs.abstract) {
      stateConfigs.routeParams = route.params.parse(stateConfigs.route);
      stateConfigs.routeRx = route.toRx(stateConfigs.route);
      vars.router.route(stateConfigs.route, stateName, (...routeValues) => {
        routeValues = routeValues.filter(value => value);
        let routeParams = route.params.assemble(stateName, routeValues);
        aptivator.activate({stateName, routeParams});
      });
    }
  }

  return vars.states.queue.length ? aptivator.state(...vars.states.queue.pop()) : aptivator;
};
