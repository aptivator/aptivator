import aptivator from '../lib/instance';
import error     from '../lib/error';
import route     from '../lib/route';
import vars      from '../lib/vars';

let {registry} = vars.states;

aptivator.href = (stateName, ...routeValues) => {
  let state = registry[stateName];
  
  if(!state) {
    error.throw(`state [${stateName}] does not exist`);
  }
  
  if(!state.route) {
    error.throw(`state [${stateName}] does not have a route`);
  }
  
  return `#${route.parts.assemble(stateName, routeValues).fragment}`;
};
