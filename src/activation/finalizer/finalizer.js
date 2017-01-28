import _        from 'lodash';
import vars     from '../../lib/vars';
import canceler from '../canceler/canceler';

let {states} = vars;

export default stateParams => {
  canceler(stateParams);
  
  let {stateName, isTransient} = stateParams;
  
  states.pending.delete(stateParams);
  
  states.activeTransient = isTransient ? stateName : undefined;
  
  if(stateParams.time) {
    console.log(`%cruntime: ${_.now() - stateParams.time}ms`, 'color: green;');
  }
  
  delete stateParams.transient;
  delete stateParams.isTransient;
  delete stateParams.time;

  return stateParams;
};
