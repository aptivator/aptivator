import error from '../../../lib/error';
import route from '../../../lib/route';
import vars  from '../../../lib/vars';

export default {
  href(stateName, ...routeValues) {
    let stateConfigs = vars.states.registry[stateName];
    
    if(!stateConfigs) {
      error.throw(`state [${stateName}] does not exist`, 'view api');
    }
    
    if(!stateConfigs.route) {
      error.throw(`state [${stateName}] does not have a route`, 'view api');
    }
    
    if(!routeValues) {
      routeValues = stateConfigs.routeValues;
    }
    
    return `#${route.parts.assemble(stateName, routeValues).fragment}`;
  }
};
