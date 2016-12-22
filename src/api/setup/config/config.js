import aptivator from '../../../lib/instance';
import vars      from '../../../lib/vars';

aptivator.config = rootConfigs => {
  if(!rootConfigs.resolveConfigs) {
    rootConfigs.resolveConfigs = {
      persist: true,
      store: true
    };
  }

  vars.states.registry[vars.rootStateName] = rootConfigs;
  
  return aptivator;
};
