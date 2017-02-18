import _                   from 'lodash';
import animationsAssembler from './animations-assembler/animations-assembler';
import stateNamesCollector from './state-names-collector/state-names-collector';

export default (stateNames, animationType) => {
  stateNames = stateNamesCollector(stateNames);
  return _.reduce(stateNames, (animations, stateName) => {
    animationsAssembler(stateName, animationType, animations);
    return animations;
  }, {});
};
