import vars      from '../../lib/vars';

export default stateParams => 
  new Promise(resolve => {
    if(vars.states.registry[vars.rootStateName].showRuntime) {
      console.log(`%cruntime: ${Date.now() - stateParams.time}ms`, 'color: green;');
    }
    
    resolve();
  });
