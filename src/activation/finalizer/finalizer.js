import _         from 'lodash';
import aptivator from '../../lib/instance';
import vars      from '../../lib/vars';

export default stateParams => 
  new Promise(resolve => {
    if(vars.states.registry[vars.rootStateName].showRuntime) {
      console.log(`%cruntime: ${Date.now() - stateParams.time}ms`, 'color: green;');
    }

    if(!stateParams.noHistory) {
      aptivator.history.set(_.cloneDeep(stateParams));
    }
    
    resolve();
  });
