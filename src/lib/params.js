import _            from 'lodash';
import addresser    from './addresser';
import relations    from './relations';
import route_       from './route';
import vars         from './vars';

let {dataParams, resolveParams} = vars;

export default {
  assemble(entityName, stateParams) {
    let {direct, route, stateName, hooks} = stateParams;
    let params = {data: {}, resolves: {}, route: {}, direct: {}, hooks: {}};
    let {data, resolves} = params;
    let family = relations.family(entityName);
    let targetEntityName = _.nth(family, -1);
    let targetStateName = addresser.stateName(targetEntityName);
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

    _.each(hooks, (hookValues, hookName) => {
      let values = [['v'], [targetStateName, 'v']].reduce((values, path) => {
        return _.extend(values, _.get(hookValues, path, {}));
      }, {});
      
      if(!_.isEmpty(values)) {
        params.hooks[hookName] = values;
      }
    });

    if(family.includes(stateName)) {
      if(direct) {
        _.extend(params, {direct});
        _.extend(stateParams, {direct});
      }
      
      _.extend(stateParams, {data, resolves});
    }
    
    return _.cloneDeep(params);
  }
};
