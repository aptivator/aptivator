import _    from 'lodash';
import vars from '../../lib/vars';

let {states} = vars;

export default stateParams => {
  let {stateName, isTransient} = stateParams;
  
  states.pending.delete(stateParams);
  
  states.activeTransient = isTransient ? stateName : undefined;
  
  if(stateParams.time) {
    console.log(`%cruntime: ${_.now() - stateParams.time}ms`, 'color: green;');
  }

  return stateParams;
};
