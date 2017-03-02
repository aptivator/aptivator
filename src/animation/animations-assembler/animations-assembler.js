import _                    from 'lodash';
import animationsAssembler  from './lib/animations-assembler';
import stateNamesAggregator from './lib/state-names-aggregator';

export default (stateNames, animationType) => {
  stateNames = stateNamesAggregator(stateNames);
  return _.reduce(stateNames, (animations, stateName) => {
    animationsAssembler(stateName, stateNames.originals, animationType, animations);
    return animations;
  }, {});
};
