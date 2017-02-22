import _         from 'lodash';
import params_   from '../../../lib/params';
import relations from '../../../lib/relations';
import vars      from '../../../lib/vars';

let paramsMap = {};

export default {
  explicit(viewConfigs) {
    let stateConfigs = vars.states.registry[viewConfigs.stateName];
    return this.explicit.cache = !_.isUndefined(viewConfigs.cache) ? viewConfigs.cache :
      !_.isUndefined(stateConfigs.cache) ? stateConfigs.cache : undefined;
  },
  
  implicit(viewConfigs, stateParams) {
    let {stateName, uniqueAddress} = viewConfigs;
    let family = relations.family(stateName).concat(uniqueAddress);
    let params = params_.assemble(family, stateParams);

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
