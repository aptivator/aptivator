import animationsAssembler from './animations-assembler/animations-assembler';
import animationsExecutor  from './animations-executor/animations-executor';

export default (statesParams, animationType) => {
  let animations = animationsAssembler(statesParams, animationType);
  return animationsExecutor(animations);
};
