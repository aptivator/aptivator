import _        from 'lodash';
import Backbone from 'backbone';
import error    from './error';
import vars     from './vars';

const routePartCleanRx = /[\(\/\:\)\*]/g;

export default {
  configure(parentConfigs, stateConfigs) {
    stateConfigs.routeParts = this.parts.parse(parentConfigs, stateConfigs);
    stateConfigs.routeParts = (parentConfigs.routeParts || []).concat(stateConfigs.routeParts);
    stateConfigs.routeValues = (parentConfigs.routeValues || []).concat(stateConfigs.routeValues || []);
    stateConfigs.route = `${parentConfigs.route && parentConfigs.route + '/' || ''}${stateConfigs.route}`;
    stateConfigs.routeRx = Backbone.Router.prototype._routeToRegExp(stateConfigs.route);
  },
  
  parts: {
    assemble: (stateName, routeValues) => {
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
      
      routeObj.fragment = fragmentParts.join('/').replace(/(\/+)/g, '/');
      return routeObj;
    },
    
    parse: (parentConfigs, stateConfigs) => {
      let routeParts = stateConfigs.route.match(/\/?[^\/]+/g);
      let {hasSplat, hasOptional} = parentConfigs;
      let paramNames = (parentConfigs.routeParts || []).reduce((paramNames, routePart) => {
        if(!_.isUndefined(routePart.required)) {
          paramNames.push(routePart.name);
        }
        return paramNames;
      }, []);
      
      return !routeParts ? [] : routeParts.map(routePart => {
        routePart = routePart.replace(/[\s\/]+/g, '');
        
        if(!routePart.match(/[\*\:]/g)) {
          if(hasSplat || hasOptional) {
            error.throw(`cannot declare a regular route part after a splat or optional parameter`, 'routing');
          }
          
          return {
            name: routePart.replace(routePartCleanRx, '')
          };
        }
        
        let paramParts = routePart.split(':');
        let isSplat = routePart.startsWith('*');
        let required = !routePart.includes(')');
        
        if(isSplat) {
          if(hasSplat) {
            error.throw('route can have only one splat', 'routing');
          }
          
          if(hasOptional) {
            error.throw('splat cannot be declared after an optional parameter', 'routing');
          }
        }
        
        if(required) {
          if(hasSplat || hasOptional) {
            error.throw(`required parameter cannot be declared after a splat or optional parameter`, 'routing');
          }
        }
        
        if(!required && hasSplat) {
          error.throw('optional parameter cannot be declared after a splat', 'routing');
        }
        
        if(!hasSplat && isSplat) {
          stateConfigs.hasSplat = hasSplat = isSplat;
        }
        
        if(!hasOptional && !required) {
          stateConfigs.hasOptional = hasOptional = !required;
        }
        
        let prefix = isSplat ? '' : paramParts[0];
        let name = isSplat ? routePart.slice(1) : paramParts[1].replace(routePartCleanRx, '');
        
        if(paramNames.includes(name)) {
          error.throw(`parameter [${name}] has already been declared`, 'routing');
        }
        
        paramNames.push(name);
        
        return {required, prefix, name};
      });
    }
  }
};
