import aptivator from '../../lib/instance';
import canceler  from '../canceler/canceler';

let pause = async ms => 
  new Promise(resolve => setTimeout(resolve, ms));

export default async stateParams => {
  canceler(stateParams);
  
  let {transient, keepLast} = stateParams;
  let lastStateParams = aptivator.history.prev() || {};
  let {stateName: lastStateName} = lastStateParams;
  let {promise, params: transientParams, timeout} = transient || {};
  let deactivate = async keepLast => {
    if(!keepLast && lastStateName) {
      let handle = `exit:${lastStateName}`;
      aptivator.deactivate({name: lastStateName});
      return aptivator.trigger(handle, lastStateParams);
    }
  };
  
  let triggerPromise = deactivate(keepLast);
  
  if(promise) {
    await promise;
    let {stateName} = transientParams;
    let handle = `exit:${stateName}`;
    keepLast = !transientParams.keepLast;
    aptivator.deactivate({name: stateName});
    aptivator.trigger(handle);
  } else if(timeout) {
    clearTimeout(timeout);
  }
  
  await triggerPromise;
  
  return stateParams;
};
