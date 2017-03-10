import animationsAssembler from './animations-assembler/animations-assembler';
import animationsExecutor  from './animations-executor/animations-executor';

export default (animationStates, animationType) => {
  let animations = animationsAssembler(animationStates, animationType);
  return animationsExecutor(animations);
};
