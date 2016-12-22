import error from '../../../lib/error';
import vars  from '../../../lib/vars';

export default (err, stateParams) => {
  let rootStateConfigs = vars.states.registry[vars.rootStateName];
  
  if(rootStateConfigs.showRuntime) {
    console.log(`runtime: ${Date.now() - stateParams.time}ms`);
  }
  
  if(err) {
    error.throw(err);
  }
};
