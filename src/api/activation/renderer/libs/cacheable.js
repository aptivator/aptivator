import _         from 'lodash';
import relations from '../../../../libs/relations';
import params    from '../../../../libs/params';
import vars      from '../../../../libs/vars';

let paramsMap = {};

export default {
  explicit: function(viewConfigs) {
    let stateConfigs = vars.states.registry[viewConfigs.stateName];
    return this.explicit.cache = !_.isUndefined(viewConfigs.cache) ? viewConfigs.cache :
      !_.isUndefined(stateConfigs.cache) ? stateConfigs.cache : undefined;
  },
  
  implicit: function(viewConfigs, stateParams, cacheAddress) {
    let {stateName, viewAddressUnique} = viewConfigs;
    let family = relations.family(stateName).concat(viewAddressUnique);
    let parameters = params.assemble(family, stateParams);

    delete parameters.data; 
    
    if(parameters.route) {
      delete parameters.route.fragment;
      delete parameters.route.stateName;
    }
    
    if(_.isEqual(paramsMap[cacheAddress], parameters)) {
      return this.implicit.cache = true;
    }

    paramsMap[cacheAddress] = parameters;
    
    return this.implicit.cache = false;
  },
  
  total: function(viewConfigs, stateParams, cacheAddress) {
    this.implicit(viewConfigs, stateParams, cacheAddress);
    
    if(!_.isUndefined(this.explicit(viewConfigs))) {
      return this.explicit.cache;
    }
    
    return this.implicit.cache;
  }
};
