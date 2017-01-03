import vars  from '../../../lib/vars';

export default (e, stateParams) => {
  if(e) {
    console.error(e);
  }

  if(vars.states.registry[vars.rootStateName].showRuntime) {
    console.log(`%cruntime: ${Date.now() - stateParams.time}ms`, 'color: green;');
  }
};
