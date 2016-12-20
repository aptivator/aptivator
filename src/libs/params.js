import _ from 'lodash';

export default {
  assemble: (family, stateParams, clone = true) => {
    let {stateName: targetStateName, dataParams, routeParams, directParams, resolveParams} = stateParams;
    let data = {};
    let resolves = {};

    family.forEach(relation => {
      _.extend(data, dataParams[relation]);
      _.extend(resolves, resolveParams[relation]);
    });
    
    let allParams = {data, resolves, route: routeParams};
    
    if(family.includes(targetStateName) && directParams) {
      allParams.direct = directParams;
    }
    
    return clone ? _.cloneDeep(allParams) : allParams;
  }
};
