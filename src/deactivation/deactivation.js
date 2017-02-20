import _           from 'lodash';
import addresser   from '../lib/addresser';
import aptivator   from '../lib/instance';
import deactivator from './deactivator/deactivator'; 

aptivator.deactivate = async params => {
  let {name, stateParams, silent} = params;

  if(!addresser.isStateAddress(name) || silent) {
    return deactivator(params);
  }
  
  if(!stateParams) {
    stateParams = aptivator.history.findOne(stateParams => {
      let {stateName, flags} = stateParams;
      let {active, pending, canceled} = flags;
      
      if(stateName === name && (active || (pending && canceled))) {
        return true;
      }
    });
  }

  if(!stateParams) {
    //return;
  }
  
  _.extend(stateParams.flags, {active: false, pending: false});
  
  if(!stateParams.flags.rendered) {
    //return stateParams.flags.canceled = true;
  }
  
  //let results = await aptivator.trigger({handle: `exit:${name}`, full: true}, stateParams);
  
  deactivator(params);
};
