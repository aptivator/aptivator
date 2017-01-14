import _                   from 'lodash';
import Backbone            from 'backbone';
import aptivator           from '../../lib/instance';
import error               from '../../lib/error';
import relations           from '../../lib/relations';
import route               from '../../lib/route';
import vars                from '../../lib/vars';
import otherStateRegistrar from './lib/other-state-registrar';

let {registry} = vars.states;

aptivator.state = (stateName, stateConfigs) => {
  function state() {
    let parentStateName = relations.parent(stateName);
    let parentConfigs = registry[parentStateName];
    
    if(relations.isRoot(stateName)) {
      error.throw(`state name [${stateName}] is reserved`);
    }
    
    if(registry[stateName]) {
      error.throw(`state [${stateName}] has already been declared`, 'state declaration');
    }
    
    if(!relations.isRoot(parentStateName) && !parentConfigs) {
      vars.states.queue.push([stateName, stateConfigs]);
      return aptivator;
    }
    
    if(stateConfigs.transient || stateConfigs.error) {
      otherStateRegistrar(stateName, vars.states[stateConfigs.transient ? 'transient' : 'error']);
      delete stateConfigs.route;
    }
    
    registry[stateName] = stateConfigs;
    
    if(stateConfigs.route) {
      stateConfigs.routeParts = route.parts.parse(parentConfigs, stateConfigs);
      stateConfigs.routeValues = (parentConfigs.routeValues || []).concat(stateConfigs.routeValues || []);
      stateConfigs.route = `${parentConfigs.route && parentConfigs.route + '/' || ''}${stateConfigs.route}`;
      stateConfigs.routeRx = Backbone.Router.prototype._routeToRegExp(stateConfigs.route);
      
      if(!stateConfigs.abstract) {
        vars.router.route(stateConfigs.route, stateName, (...routeValues) => {
          routeValues = routeValues.filter(value => value);
          let routeParams = route.parts.assemble(stateName, routeValues);
          aptivator.activate({name: stateName, route: routeParams}).catch(_.noop);
        });
      }
    }
  
    return vars.states.queue.length ? aptivator.state(...vars.states.queue.pop()) : aptivator;
  }
  
  try {
    state();
  } catch(e) {
    console.error(e);
  }
};
