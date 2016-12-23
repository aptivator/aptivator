import _        from 'lodash';
import Backbone from 'backbone';
import error    from './error';
import vars     from './vars';

const paramRx = /(\(?\/?([\w-]+)?\:[\w-]+\)?)|(\*[\w-]+)/g;
const paramCleanRx = /[\(\/\:\)\*]/g;

export default {
  make: (parent, child) => parent ? `${parent}/${child}` : child,
  
  toRx: Backbone.Router.prototype._routeToRegExp,
  
  params: {
    assemble: (stateName, routeValues) => {
      let stateConfigs = vars.states.registry[stateName];
      if(!stateConfigs.route) { return; }
      let fragmentParts = [];
      let routeParts = stateConfigs.route.split(/[\/]|(?:\s*(?=\*))/);
      let index = -1;
      let routeObj = {params: {}};
      
      if(_.isEmpty(routeValues)) {
        routeValues = stateConfigs.routeValues || [];
      }
      
      routeParts.forEach(routePart => {
        if(!/[\:\*]/.test(routePart)) {
          return fragmentParts.push(routePart.replace(paramCleanRx, ''));
        }
        
        let param = stateConfigs.routeParams[++index];
        
        if(param.required && !routeValues[index]) {
          error.throw(`Expecting a value for [${param.name}] parameter`);
        }
        
        if(routeValues[index]) {
          routeObj.params[param.name] = routeValues[index];
          fragmentParts.push(param.prefix + routeValues[index]);
        }
      });
      
      routeObj.fragment = fragmentParts.join('/').replace(/(\/+)/g, '/');
      return routeObj;
    },
    
    parse: route => {
      let params = route.match(paramRx);
      return !params ? [] : params.map(param => {
        let paramParts = param.split(':');
        return {
          required: /^[^\(|\*]/.test(param),
          prefix: param.startsWith('*') ? '' : paramParts[0].replace(paramCleanRx, ''),
          name: param.startsWith('*') ? param.slice(1) : paramParts[1].replace(paramCleanRx, '')
        };
      });
    }
  }
};
