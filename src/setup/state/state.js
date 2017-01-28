import _                   from 'lodash';
import Backbone            from 'backbone';
import aptivator           from '../../lib/instance';
import error               from '../../lib/error';
import relations           from '../../lib/relations';
import route_              from '../../lib/route';
import vars                from '../../lib/vars';
import otherStateRegistrar from './lib/other-state-registrar';

let {registry, queue} = vars.states;
let rootStateProperties = ['view', 'resolves', 'data', 'route', 'resolveConfigs', 'detachHidden'];

aptivator.state = (stateName, stateConfigs) => 
  !async function() {
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
      {
        let routeParts = route_.parts.parse(parentConfigs, stateConfigs);
        let routeValues = (parentConfigs.routeValues || []).concat(stateConfigs.routeValues || []);
        let route = `${parentConfigs.route && parentConfigs.route + '/' || ''}${stateConfigs.route}`;
        let routeRx = Backbone.Router.prototype._routeToRegExp(route);
        _.extend(stateConfigs, {route, routeParts, routeRx, routeValues});
      }
      
      if(!stateConfigs.abstract) {
        vars.router.route(stateConfigs.route, stateName, (...routeValues) => {
          let route = route_.parts.assemble(stateName, routeValues.filter(value => value));
          aptivator.activate({stateName, route}).catch(_.noop);
        });
      }
    }
  
    return vars.states.queue.length ? aptivator.state(...vars.states.queue.pop()) : aptivator;
  }().catch(error.errorer);
