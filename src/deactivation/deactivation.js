import _           from 'lodash';
import aptivator   from '../lib/instance';
import error       from '../lib/error';
import deactivator from './deactivator/deactivator'; 

aptivator.deactivate = async params => {
  let {name, forward, focal, stateParams, silent} = params;

  if(forward && focal) {
    error.throw(`use either [focal] or [forward] flag`, 'deactivator');
  }
  
  if(name.includes('@')) {
    silent = true;
  }
  
  if(silent) {
    return deactivator(params);
  }
  
  if(!stateParams) {
    stateParams = aptivator.history.getOne(stateParams => {
      let {stateName, flags} = stateParams;
      let {active, pending, canceled} = flags;
      
      if(stateName === name && (active || (pending && canceled))) {
        return true;
      }
    });
  }

  if(!stateParams) {
    return;
  }
  
  _.extend(stateParams.flags, {active: false, pending: false});
  
  if(!stateParams.flags.rendered) {
    return stateParams.flags.canceled = true;
  }
  
  deactivator(params);

  return aptivator.trigger(`exit:${name}`, stateParams).then(results => {
    _.extend(stateParams.hooks, results);
    return results;
  });
};
