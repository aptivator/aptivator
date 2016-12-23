import _         from 'lodash';
import addresser from './addresser';
import route     from './route';
import utils     from './utils';
import vars      from './vars';

export default {
  assemble: (family, stateParams, clone = true) => {
    let {stateName, dataParams, routeParams, directParams, resolveParams} = stateParams;
    let data = {};
    let resolves = {};
    let targetStateName = family[family.length - 1];
    targetStateName = utils.hasAt(targetStateName) ? addresser.stateName(targetStateName) : targetStateName;
    let stateConfigs = vars.states.registry[targetStateName];
    
    if(stateConfigs.routeParams) {
      var routeParamsNames = stateConfigs.routeParams.reduce((names, routeParamsConfigs) => 
        (names.push(routeParamsConfigs.name), names), []);
    }

    let routeValues = _.values(_.pick(routeParams.params, routeParamsNames));
    
    family.forEach(relation => {
      _.extend(data, dataParams[relation]);
      _.extend(resolves, resolveParams[relation]);
    });
    
    let allParams = {data, resolves};
    
    if(stateConfigs.route) {
      _.extend(allParams, {
        route: route.params.assemble(targetStateName, routeValues)
      });
    }
    
    if(family.includes(stateName) && directParams) {
      allParams.direct = directParams;
    }
    
    return clone ? _.cloneDeep(allParams) : allParams;
  }
};
