import aptivator from '../../libs/instance';
import error     from '../../libs/error';
import route     from '../../libs/route';
import vars      from '../../libs/vars';

let {registry} = vars.states;

aptivator.href = (stateName, ...routeValues) => {
  let state = registry[stateName];
  
  if(!state) {
    error.throw(`state [${stateName}] does not exist`);
  }
  
  if(!state.route) {
    error.throw(`state [${stateName}] does not have a route`);
  }
  
  return `#${route.params.assemble(stateName, routeValues).fragment}`;
};
