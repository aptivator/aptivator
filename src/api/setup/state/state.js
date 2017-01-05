import aptivator from '../../../lib/instance';
import error     from '../../../lib/error';
import relations from '../../../lib/relations';
import route     from '../../../lib/route';
import vars      from '../../../lib/vars';

let {registry} = vars.states;

let countDots = str => {
  let matches = str.match(/\./g);
  return matches ? matches.length : 0;
};

let determineStore = stateName => countDots(stateName) ? 'nested' : 'root';

aptivator.state = (stateName, stateConfigs) => {
  let parentStateName = relations.parent(stateName);
  let parentConfigs = registry[parentStateName];
  
  if(!relations.isRoot(parentStateName) && !parentConfigs) {
    vars.states.queue.push([stateName, stateConfigs]);
    return aptivator;
  }
  
  if(stateConfigs.transient || stateConfigs.error) {
    delete stateConfigs.route;
  }
  
  if(stateConfigs.error) {
    let store = determineStore(stateName);
    
    vars.states.error[store].push(stateName);
    
    if(vars.states.error.root.length > 1) {
      error.throw('there should be only one root error state', 'state declaration');
    }
  }
  
  if(stateConfigs.transient) {
    vars.states.transient.push(stateName);
  }
  
  registry[stateName] = stateConfigs;
  
  if(stateConfigs.route) {
    route.configure(parentConfigs, stateConfigs);
    
    if(!stateConfigs.abstract) {
      vars.router.route(stateConfigs.route, stateName, (...routeValues) => {
        routeValues = routeValues.filter(value => value);
        let routeParams = route.parts.assemble(stateName, routeValues);
        aptivator.activate({stateName, routeParams});
      });
    }
  }

  return vars.states.queue.length ? aptivator.state(...vars.states.queue.pop()) : aptivator;
};
