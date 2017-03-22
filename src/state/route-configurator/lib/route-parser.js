import _     from 'lodash';
import error from '../../../lib/error';

const routePartCleanRx = /[\(\/\:\)\*]/g;

export default (route, parentRoute) => {
  let {path} = route;
  let parts = path.match(/\/?[^\/]+/g);
  let {hasSplat, hasOptional, parts: parentParts = []} = parentRoute;
  let names = parentParts.reduce((names, part) => {
    if(!_.isUndefined(part.required)) {
      names.push(part.name);
    }
    return names;
  }, []);
  
  parts = !parts ? [] : parts.map(part => {
    part = part.replace(/[\s\/]+/g, '');
    
    if(!part.match(/[\*\:]/g)) {
      if(hasSplat || hasOptional) {
        error.throw('cannot declare a regular route part after a splat or optional parameter', 'routing');
      }
      
      return {name: part.replace(routePartCleanRx, '')};
    }
    
    let paramParts = part.split(':');
    let isSplat = part.startsWith('*');
    let required = isSplat || !part.includes(')');
    
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
        error.throw('required parameter cannot be declared after a splat or optional parameter', 'routing');
      }
    }
    
    if(!required && hasSplat) {
      error.throw('optional parameter cannot be declared after a splat', 'routing');
    }
    
    if(!hasSplat && isSplat) {
      route.hasSplat = hasSplat = isSplat;
    }
    
    if(!hasOptional && !required) {
      route.hasOptional = hasOptional = !required;
    }
    
    let prefix = isSplat ? '' : paramParts[0];
    let name = isSplat ? part.slice(1) : paramParts[1].replace(routePartCleanRx, '');
    
    if(names.includes(name)) {
      error.throw(`parameter [${name}] has already been declared`, 'routing');
    }
    
    names.push(name);
    
    return {required, prefix, name};
  });
  
  _.extend(route, {parts: parentParts.concat(parts)});
};
