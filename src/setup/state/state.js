import _                   from 'lodash';
import Backbone            from 'backbone';
import aptivator           from '../../lib/instance';
import error               from '../../lib/error';
import fragment_           from '../../lib/fragment';
import relations           from '../../lib/relations';
import route_              from '../../lib/route';
import vars                from '../../lib/vars';
import otherStateRegistrar from './lib/other-state-registrar';

let {registry, queue} = vars.states;
let rootStateProperties = ['view', 'resolve', 'data', 'route', 'resolveConfigs', 'detachHidden'];

aptivator.state = (stateName, stateConfigs) => {
  try {
    if(registry[stateName]) {
      error.throw(`state [${stateName}] has already been declared`, 'state declaration');
    }
    
    if(relations.isRoot(stateName)) {
      var root = true;
      stateConfigs = _.pick(stateConfigs, rootStateProperties);
      _.extend(stateConfigs, {viewAddressUnique: stateName});
      
      if(!stateConfigs.resolveConfigs) {
        stateConfigs.resolveConfigs = {
          persist: true,
          store: true
        };
      }
      
      if(_.isUndefined(stateConfigs.detachHidden)) {
        stateConfigs.detachHidden = false;
      }
    }
    
    let parentStateName = root ? null : relations.parent(stateName);
    let parentConfigs = root ? {} : registry[parentStateName];    
    
    if(!parentConfigs) {
      queue.push([stateName, stateConfigs]);
      return aptivator;
    }
    
    if(stateConfigs.transient || stateConfigs.error) {
      otherStateRegistrar(stateName, vars.states[stateConfigs.transient ? 'transient' : 'error']);
      delete stateConfigs.route;
    }
    
    registry[stateName] = stateConfigs;
    
    if(stateConfigs.route) {
      stateConfigs.routeParts = route_.parts.parse(parentConfigs, stateConfigs);
      stateConfigs.routeValues = (parentConfigs.routeValues || []).concat(stateConfigs.routeValues || []);
      stateConfigs.route = `${parentConfigs.route && parentConfigs.route + '/' || ''}${stateConfigs.route}`;
      stateConfigs.routeRx = Backbone.Router.prototype._routeToRegExp(stateConfigs.route);
      
      if(!stateConfigs.abstract) {
        vars.router.route(stateConfigs.route, stateName, (...routeValues) => {
          let routeParams = route_.parts.assemble(stateName, routeValues.filter(value => value));
          aptivator.activate({stateName, routeParams}).catch(_.noop);
        });
      }
    }
  
    return vars.states.queue.length ? aptivator.state(...vars.states.queue.pop()) : aptivator;
  } catch(e) {
    error.errorer(e);
  }
};
