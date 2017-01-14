import _            from 'lodash';
import approximator from '../../../lib/approximator';
import aptivator    from '../../../lib/instance';
import fragment     from '../../../lib/fragment';

export default () => {
  if(fragment.toState()) {
    return;
  }
  
  let hash = fragment.get();
  let stateName = approximator.fromHash(hash);
  
  if(stateName) {
    stateName += '.noop';
  }
  
  stateName = approximator.fromStateName('error', stateName);
  
  if(!stateName) {
    return alert(`Provided route [${hash}] is invalid`);
  } 
  
  aptivator.activate({name: stateName, direct: {fragment: hash}}).catch(_.noop);
};
