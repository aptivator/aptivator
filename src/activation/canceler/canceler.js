
import aptivator from '../../lib/instance';

export default stateParams => {
  let {stateName, flags} = stateParams;
  
  if(flags.canceled) {
    aptivator.deactivate({name: stateName, stateParams});
    throw 'canceled';
  }
  
  return stateParams;
};
