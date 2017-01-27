import _    from 'lodash';
import vars from './vars';

let {dataParams, resolveParams} = vars;

export default {
  assemble(family, stateParams, clone = true) {
    let {stateName, routeParams, directParams} = stateParams;
    let params = {dataParams: {}, resolveParams: {}, routeParams};
    
    family.forEach(relation => {
      _.extend(params.dataParams, dataParams[relation]);
      _.extend(params.resolveParams, resolveParams[relation]);
    });
    

    if(family.includes(stateName)) {
      _.extend(params, {directParams});
      _.extend(stateParams, {resolveParams: params.resolveParams, dataParams: params.dataParams});
    }
    
    return params;
  }
};
