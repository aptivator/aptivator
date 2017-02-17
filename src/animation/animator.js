import animationsAssembler from './animations-assembler/animations-assembler';
import animationsExecutor  from './animations-executor/animations-executor';

export default (stateNames, animationType) => {
  let animations = animationsAssembler(stateNames, animationType);
  return animationsExecutor(animations);
};
