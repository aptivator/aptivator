import _            from 'lodash';
import approximator from './approximator';
import aptivator    from './aptivator';
import fragment     from './fragment';

export default (hash = fragment.get()) => {
  if(!hash) {
    return;
  }
  
  let stateName = approximator.fromHash(hash);

  if(stateName) {
    stateName += '.noop';
  }

  stateName = approximator.fromStateName('error', stateName);

  if(!stateName) {
    return alert(`Provided route [${hash}] is invalid`);
  } 
  
  aptivator.activate({stateName, route: {fragment: hash}}).catch(_.noop);    
};
