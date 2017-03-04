import _        from 'lodash';
import error    from './error';
import vars     from './vars';

export default {
  parts: {
    assemble(stateName, routeValues) {
      let stateConfigs = vars.states.registry[stateName];
      let fragmentParts = [];
      let index = -1;
      let routeObj = {params: {}};
      
      if(!stateConfigs.route) { 
        return; 
      }
      
      if(_.isEmpty(routeValues)) {
        routeValues = stateConfigs.routeValues || [];
      }
      
      stateConfigs.routeParts.forEach(routePart => {
        if(_.isUndefined(routePart.required)) {
          return fragmentParts.push(routePart.name);
        }
        
        if(!routeValues[++index] && routePart.required) {
          error.throw(`expecting a value for [${routePart.name}] parameter`, 'routing');
        }
        
        if(routeValues[index]) {
          routeObj.params[routePart.name] = routeValues[index];
          fragmentParts.push(routePart.prefix + routeValues[index]);
        }
      });
      
      let fragment = fragmentParts.join('/').replace(/(\/+)/g, '/');
      return _.extend(routeObj, {fragment, stateName});
    }
  }
};
