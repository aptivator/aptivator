import _         from 'lodash';
import Backbone  from 'backbone';
import aptivator from '../../lib/aptivator';
import route_    from '../../lib/route';
import vars      from '../../lib/vars';

let {router} = vars;

export default (stateConfigs, parentConfigs) => {
  let {abstract, stateName} = stateConfigs;
  
  let routeParts = route_.parts.parse(parentConfigs, stateConfigs);
  let routeValues = (parentConfigs.routeValues || []).concat(stateConfigs.routeValues || []);
  let route = `${parentConfigs.route && parentConfigs.route + '/' || ''}${stateConfigs.route}`;
  let routeRx = Backbone.Router.prototype._routeToRegExp(route);
  
  _.extend(stateConfigs, {route, routeParts, routeRx, routeValues});
  
  if(!abstract) {
    router.route(route, stateName, (...routeValues) => {
      let route = route_.parts.assemble(stateName, _.compact(routeValues));
      aptivator.activate({stateName, route}).catch(_.noop);
    });
  }  
};
