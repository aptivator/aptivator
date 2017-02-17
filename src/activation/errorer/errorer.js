import _         from 'lodash';
import aptivator from '../../lib/instance';

export default async (e, stateParams) => {
  if(!(e instanceof Error)) {
    let eventName = 'error';
    let errorStateHandle = `${eventName}:${stateParams.stateName}:${e}`;
    let errorHandle = `${eventName}:${e}`;
    
    let results = await aptivator.trigger([
      {handle: errorStateHandle, full: true},
      errorHandle
    ], e, stateParams);
    
    _.extend(stateParams.hooks, results);
    _.extend(stateParams.flags, {[e]: true});
  }
  
  console.error(e);
  throw e;
};
