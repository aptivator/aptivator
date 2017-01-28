import _    from 'lodash';
import vars from './vars';

let {dataParams, resolveParams} = vars;

export default {
  assemble(family, stateParams) {
    let {direct, route, stateName} = stateParams;
    let params = {data: {}, resolves: {}, route};
    let {data, resolves} = params;
    
    family.forEach(relation => {
      _.extend(data, dataParams[relation]);
      _.extend(resolves, resolveParams[relation]);
    });
    

    if(family.includes(stateName)) {
      _.extend(params, {direct});
      _.extend(stateParams, {data, resolves});
    }
    
    return _.cloneDeep(params);
  }
};
