import _                   from 'lodash';
import animationsAssembler from './animations-assembler/animations-assembler';
import animationsExecutor  from './animations-executor/animations-executor';

export default (animationStates, animationType) => {
  if(_.isPlainObject(animationStates)) {
    animationStates = [animationStates];
  }
  
  let animations = animationsAssembler(animationStates, animationType);
  return animationsExecutor(animations);
};
