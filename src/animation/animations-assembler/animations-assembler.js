import _                    from 'lodash';
import animationsAssembler  from './lib/animations-assembler';
import stateNamesAggregator from './lib/state-names-aggregator';

export default (animationStates, animationType) => {
  animationStates = stateNamesAggregator(animationStates);
  return _.reduce(animationStates, (animations, animationState) => {
    let {stateName, stateParams} = animationState;
    animationsAssembler(stateName, stateParams, animationType, animations);
    return animations;
  }, {});
};
