import _                        from 'lodash';
import Backbone                 from 'backbone';
import aptivator                from '../../lib/aptivator';
import route_                   from '../../lib/route';
import vars                     from '../../lib/vars';
import routeParser              from './lib/route-parser';
import valuesAssertersAssembler from './lib/values-asserters-assembler';

let {router} = vars;

export default (stateConfigs, parentConfigs) => {
  let {abstract, stateName, route} = stateConfigs;
  let {route: parentRoute = {}} = parentConfigs;
  let {path = ''} = route;
  let {path: parentPath = ''} = parentRoute;
  
  if(path && !abstract) {
    path = (parentPath && parentPath + '/') + path;
    var rx = Backbone.Router.prototype._routeToRegExp(path);
  }
  
  routeParser(route, parentRoute);
  valuesAssertersAssembler(route, parentRoute);
  _.extend(route, {path, rx});
  
  if(rx) {
    router.route(rx, stateName, (...routeValues) => {
      let route = route_.parts.assemble(stateName, _.compact(routeValues));
      aptivator.activate({stateName, route}).catch(_.noop);
    });
  }  
};
