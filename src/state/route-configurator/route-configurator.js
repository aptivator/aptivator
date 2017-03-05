import _                        from 'lodash';
import Backbone                 from 'backbone';
import aptivator                from '../../lib/aptivator';
import routeAssembler           from '../../lib/route/route-assembler';
import vars                     from '../../lib/vars';
import routeParser              from './lib/route-parser';
import valuesAssertersAssembler from './lib/values-asserters-assembler';

let {router} = vars;

export default (stateConfigs, parentConfigs) => {
  let {abstract, stateName, route} = stateConfigs;
  let {route: parentRoute = {}} = parentConfigs;
  
  if(_.isString(route)) {
    route = {path: route};
    _.extend(stateConfigs, {route});
  }
  
  let {path = ''} = route;
  let {path: parentPath = ''} = parentRoute;
  path = (parentPath && parentPath + '/') + path;
  
  if(path) {
    var rx = Backbone.Router.prototype._routeToRegExp(path);
  }
  
  routeParser(route, parentRoute);
  valuesAssertersAssembler(route, parentRoute);
  _.extend(route, {path, rx});
  
  if(!abstract) {
    router.route(rx, stateName, (...routeValues) => {
      try {
        let route = routeAssembler(stateName, _.compact(routeValues), true);
        aptivator.activate({stateName, route}).catch(_.noop);
      } catch(e) {
        console.error(e);
      }
    });
  }  
};
