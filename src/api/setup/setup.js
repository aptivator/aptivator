import _         from 'underscore';
import aptivator from '../../libs/instance';
import relations from '../../libs/relations';
import route     from '../../libs/route';
import vars      from '../../libs/vars';

aptivator.config = rootConfigs => {
  _.isUndefined(rootConfigs.persistResolves) && (rootConfigs.persistResolves = true);
  vars.states.registry[vars.rootStateName] = rootConfigs;
  return aptivator;
};

aptivator.state = (stateName, stateConfigs) => {
  let parentStateName = relations.parent(stateName);
  let parentConfigs = vars.states.registry[parentStateName];
  
  if(!relations.isRoot(parentStateName) && !parentConfigs) {
    vars.states.queue.push([stateName, stateConfigs]);
    return aptivator;
  }
  
  vars.states.registry[stateName] = stateConfigs;
  
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
