import aptivator from '../../../lib/instance';
import vars      from '../../../lib/vars';

aptivator.config = rootConfigs => {
  if(!rootConfigs.persistResolves) {
    rootConfigs.persistResolves = true;
  }

  vars.states.registry[vars.rootStateName] = rootConfigs;
  
  return aptivator;
};
