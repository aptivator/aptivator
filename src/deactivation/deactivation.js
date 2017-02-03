import _           from 'lodash';
import aptivator   from '../lib/instance';
import error       from '../lib/error';
import deactivator from './lib/deactivator'; 

aptivator.deactivate = async params => {
  let {name, forward, focal, stateParams} = params;
  
  console.log(params);
  
  if(forward && focal) {
    error.throw(`use either [focal] or [forward] flag`, 'deactivator');
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

  let {transientConfigs} = stateParams;

  if(transientConfigs) {
    let {params: stateParams} = transientConfigs;
    
    if(!stateParams.flags.rendered) {
      stateParams.flags.canceled = true;
    } else {
      await aptivator.deactivate({name: stateParams.stateName, stateParams});
    }
  }

  if(stateParams.flags.rendered) {
    let method = focal || forward ? 'partial' : 'full';
    deactivator[method](params);
  }

  _.extend(stateParams.flags, {active: false, pending: false});

  return aptivator.trigger(`exit:${name}`, stateParams).then(results => {
    _.extend(stateParams.hooks, results);
    return results;
  });
};
