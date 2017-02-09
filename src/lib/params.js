import _         from 'lodash';
import addresser from './addresser';
import route_    from './route';
import vars      from './vars';

let {dataParams, resolveParams} = vars;

export default {
  assemble(family, stateParams) {
    let {direct, route, stateName} = stateParams;
    let params = {data: {}, resolves: {}, route: {}};
    let {data, resolves} = params;
    let targetEntityName = _.nth(family, -1);
    let targetStateName = targetEntityName.includes('@') ? addresser.stateName(targetEntityName) : targetEntityName;
    let targetStateConfigs = vars.states.registry[targetStateName];
    let {error} = targetStateConfigs;
    
    if(route && targetStateConfigs.route) {
      let {routeParts} = targetStateConfigs;
      if(routeParts.length) {
        let routeParamNames = routeParts.reduce((names, routeParamConfigs) => {
          if(!_.isUndefined(routeParamConfigs.required)) {
            names.push(routeParamConfigs.name);
          }
          return names;
        }, []);
        
        let routeValues = _.values(_.pick(route.params, routeParamNames));
        
        _.extend(params, {route: route_.parts.assemble(targetStateName, routeValues)});
        params.route.fragment = route.fragment;
      }
    }
    
    if(error) {
      _.extend(params, {route});
    }
    
    family.forEach(relation => {
      _.extend(data, dataParams[relation]);
      _.extend(resolves, resolveParams[relation]);
    });

    if(family.includes(stateName)) {
      if(direct) {
        _.extend(params, {direct});
        _.extend(stateParams, {direct});
      }
      
      _.extend(stateParams, {data, resolves});
    }
    
    if(!params.direct) {
      params.direct = {};
    }
    
    return _.cloneDeep(params);
  }
};
