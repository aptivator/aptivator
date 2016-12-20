import aptivator from '../libs/instance';
import error     from '../libs/error';
import route     from '../libs/route';
import vars      from '../libs/vars';

aptivator.href = (stateName, ...routeValues) => 
  !vars.states.registry[stateName] ? error.throw(`state [${stateName}] does not exist`) :
  !vars.states.registry[stateName].route ? error.throw(`state [${stateName}] does not have a route`) :
  `#${route.params.assemble(stateName, routeValues).fragment}`;
