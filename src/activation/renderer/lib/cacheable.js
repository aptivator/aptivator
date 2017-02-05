import _         from 'lodash';
import params_   from '../../../lib/params';
import relations from '../../../lib/relations';
import vars      from '../../../lib/vars';

let paramsMap = {};

export default {
  explicit: function(viewConfigs) {
    let stateConfigs = vars.states.registry[viewConfigs.stateName];
    return this.explicit.cache = !_.isUndefined(viewConfigs.cache) ? viewConfigs.cache :
      !_.isUndefined(stateConfigs.cache) ? stateConfigs.cache : undefined;
  },
  
  implicit: function(viewConfigs, stateParams) {
    let {stateName, viewAddressUnique} = viewConfigs;
    let family = relations.family(stateName).concat(viewAddressUnique);
    let params = params_.assemble(family, stateParams);

    delete params.data; 
    
    if(params.route) {
      delete params.route.fragment;
      delete params.route.stateName;
    }
    
    if(_.isEqual(paramsMap[viewAddressUnique], params)) {
      return this.implicit.cache = true;
    }

    paramsMap[viewAddressUnique] = params;
    
    return this.implicit.cache = false;
  },
  
  total: function(viewConfigs, stateParams) {
    this.implicit(viewConfigs, stateParams);
    
    if(!_.isUndefined(this.explicit(viewConfigs))) {
      return this.explicit.cache;
    }
    
    return this.implicit.cache;
  }
};
