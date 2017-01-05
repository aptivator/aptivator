import _         from 'lodash';
import addresser from './addresser';
import route     from './route';
import vars      from './vars';

export default {
  assemble: (family, stateParams, clone = true) => {
    let {stateName, dataParams, routeParams, directParams, resolveParams} = stateParams;
    let data = {};
    let resolves = {};
    let targetStateName = family[family.length - 1];
    targetStateName = targetStateName.includes('@') ? addresser.stateName(targetStateName) : targetStateName;
    let stateConfigs = vars.states.registry[targetStateName];
    
    if(stateConfigs.routeParts) {
      var routeParamsNames = stateConfigs.routeParts.reduce((names, routePart) => {
        if(!_.isUndefined(routePart.required)) {
          names.push(routePart.name);
        }
        
        return names;
      }, []);
    }

    let routeValues = !routeParams ? [] : _.values(_.pick(routeParams.params, routeParamsNames));
    
    family.forEach(relation => {
      _.extend(data, dataParams[relation]);
      _.extend(resolves, resolveParams[relation]);
    });
    
    let allParams = {data, resolves};
    
    if(stateConfigs.route) {
      _.extend(allParams, {
        route: route.parts.assemble(targetStateName, routeValues)
      });
    }
    
    if(family.includes(stateName) && directParams) {
      allParams.direct = directParams;
    }
    
    return clone ? _.cloneDeep(allParams) : allParams;
  }
};
