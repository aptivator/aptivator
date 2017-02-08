import _         from 'lodash';
import aptivator from '../../lib/instance';

export default async (e, stateParams) => {
  if(!(e instanceof Error)) {
    let errorStateHandle = `error:${stateParams.stateName}:${e}`;
    let errorHandle = `error:${e}`;
    
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
