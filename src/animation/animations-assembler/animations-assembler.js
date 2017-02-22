import _                    from 'lodash';
import animationsAssembler  from './animations-assembler/animations-assembler';
import stateNamesAggregator from './state-names-aggregator/state-names-aggregator';

export default (stateNames, animationType) => {
  stateNames = stateNamesAggregator(stateNames);
  return _.reduce(stateNames, (animations, stateName) => {
    animationsAssembler(stateName, animationType, animations);
    return animations;
  }, {});
};
