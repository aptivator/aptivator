import _         from 'lodash';
import params_   from '../../../lib/params';
import vars      from '../../../lib/vars';

let {paramsMap, states} = vars;
let {registry} = states;

export default {
  explicit(viewConfigs) {
    let {stateName, record, cache: viewCacheFlag} = viewConfigs;
    let {instance} = record;
    let stateConfigs = registry[stateName];
    let {cache: stateCacheFlag} = stateConfigs;
    let cache;
    
    if(instance) {
      if(!_.isUndefined(viewCacheFlag)) {
        cache = viewCacheFlag;
      } else if(!_.isUndefined(stateCacheFlag)) {
        cache = stateCacheFlag;
      }
    }

    return this.explicit.cache = cache;
  },
  
  implicit(viewConfigs, stateParams) {
    let {uniqueAddress} = viewConfigs;
    let params = params_.assemble(uniqueAddress, stateParams);

    delete params.data; 
    
    if(params.route) {
      delete params.route.fragment;
      delete params.route.stateName;
    }

    if(_.isEqual(paramsMap[uniqueAddress], params)) {
      return this.implicit.cache = true;
    }

    paramsMap[uniqueAddress] = params;
    
    return this.implicit.cache = false;
  },
  
  total(viewConfigs, stateParams) {
    this.implicit(viewConfigs, stateParams);
    
    if(!_.isUndefined(this.explicit(viewConfigs))) {
      return this.explicit.cache;
    }
    
    return this.implicit.cache;
  }
};
