import _             from 'lodash';
import error         from '../error';
import errorStater   from '../error-stater';
import vars          from '../vars';
import routeAsserter from './route-asserter';

let {registry} = vars.states;
let moduleName = 'route assembler';

export default (stateName, routeValues, activating) => {
  let stateConfigs = registry[stateName];
  
  if(!stateConfigs) {
    error.throw(`state [${stateName}] does not exist`, moduleName);
  }
  
  let {route = {}} = stateConfigs;
  
  if(_.isEmpty(route)) {
    error.throw(`state [${stateName}] does not have a route`, moduleName);
  }
  
  let {values = [], parts, asserters} = route;
  let fragments = [];
  let index = -1;
  let routeObj = {params: {}};
  
  if(_.isEmpty(routeValues)) {
    routeValues = values;
  }
  
  if(asserters.length) {
    if(!routeAsserter(routeValues, asserters)) {
      if(activating) {
        errorStater();
      } 
        
      error.throw('a route value did not pass validation', moduleName);
    }
  }
  
  _.each(parts, part => {
    let {required, name, prefix} = part;
    
    if(_.isUndefined(required)) {
      return fragments.push(name);
    }

    if(!routeValues[++index] && required) {
      error.throw(`expecting a value for [${name}] parameter`, moduleName);
    }
    
    if(routeValues[index]) {
      routeObj.params[name] = routeValues[index];
      fragments.push(prefix + routeValues[index]);
    }
  });
  
  let fragment = fragments.join('/').replace(/(\/+)/g, '/');
  return _.extend(routeObj, {fragment, stateName});
};
