import aptivator from '../../lib/instance';
import canceler  from '../canceler/canceler';

let pause = async ms => 
  new Promise(resolve => setTimeout(resolve, ms));

export default async stateParams => {
  canceler(stateParams);
  
  if(stateParams.abort) {
    throw 'abort';
  }
  
  let {transient, keepLast} = stateParams;
  let {stateName: lastStateName} = aptivator.history.prev() || {};
  let {promise, params: transientParams, timeout} = transient || {};
  let deactivate = keepLast => {
    if(!keepLast && lastStateName) {
      aptivator.deactivate({name: lastStateName});
    }
  };
  
  if(promise) {
    await promise;
    let {stateName} = transientParams;
    keepLast = !transientParams.keepLast;
    aptivator.deactivate({name: stateName});
  } else if(timeout) {
    clearTimeout(timeout);
  }
  
  deactivate(keepLast);
  await pause(20);
  return stateParams;
};
