import _         from 'lodash';
import params    from '../../../lib/params';
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
    let parameters = params.assemble(family, stateParams);

    delete parameters.data; 
    
    if(parameters.route) {
      delete parameters.route.fragment;
      delete parameters.route.stateName;
    }
    
    if(_.isEqual(paramsMap[viewAddressUnique], parameters)) {
      return this.implicit.cache = true;
    }

    paramsMap[viewAddressUnique] = parameters;
    
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
