import error from '../../../lib/error';
import vars  from '../../../lib/vars';

export default (err, stateParams) => {
  let rootStateConfigs = vars.states.registry[vars.rootStateName];
  
  if(err) {
    console.error(error.message(err));
  }
  
  if(rootStateConfigs.showRuntime) {
    console.log(`runtime: ${Date.now() - stateParams.time}ms`);
  }
};
