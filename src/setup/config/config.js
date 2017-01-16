import _         from 'lodash';
import aptivator from '../../lib/instance';
import vars      from '../../lib/vars';

aptivator.config = rootConfigs => {
  if(!rootConfigs.resolveConfigs) {
    rootConfigs.resolveConfigs = {
      persist: true,
      store: true
    };
  }
  
  if(_.isUndefined(rootConfigs.detachHidden)) {
    rootConfigs.detachHidden = false;
  }

  vars.states.registry[vars.rootStateName] = _.extend(rootConfigs, {viewAddressUnique: vars.rootStateName});
  
  return aptivator;
};
