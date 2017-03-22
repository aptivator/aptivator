import _                        from 'lodash';
import Backbone                 from 'backbone';
import aptivator                from '../../lib/aptivator';
import routeAssembler           from '../../lib/route/route-assembler';
import routeParser              from './lib/route-parser';
import valuesAssertersAssembler from './lib/values-asserters-assembler';

import {router} from '../../lib/vars';

export default (stateConfigs, parentConfigs) => {
  let {abstract, stateName, route} = stateConfigs;
  let {route: parentRoute = {}} = parentConfigs;
  
  if(_.isString(route)) {
    route = {path: route};
    _.extend(stateConfigs, {route});
  }
  
  let {path = '', standalone = false} = route;
  let {path: parentPath = ''} = parentRoute;
  
  if(path.startsWith('^')) {
    path = path.slice(1);
    standalone = true;
    _.extend(route, {path, standalone});
  }
  
  if(standalone) {
    parentPath = '';
  }
  
  path = (parentPath && parentPath + '/') + path;
  
  if(path) {
    var rx = Backbone.Router.prototype._routeToRegExp(path);
  }
  
  routeParser(route, parentRoute);
  valuesAssertersAssembler(route, standalone ? {} : parentRoute);
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
