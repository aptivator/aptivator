import _            from 'lodash';
import approximator from '../../../lib/approximator';
import aptivator    from '../../../lib/instance';
import vars         from '../../../lib/vars';

export default () => {
  vars.router.route('*error', hash => {
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
  });  
};
