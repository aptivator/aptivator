import aptivator from '../../lib/instance';

export default async stateParams => {
  let {transient, keepLast} = stateParams;
  let {stateName: lastStateName} = aptivator.history.prev() || {};
  let {promise, params: transientParams, timeout} = transient || {};
  let deactivate = keepLast => {
    if(!keepLast && lastStateName) {
      aptivator.deactivate({name: lastStateName});
    }
    return stateParams;
  };
  
  if(promise) {
    await promise;
    let {name} = transientParams;
    keepLast = !transientParams.keepLast;
    aptivator.deactivate({name});
  } else {
    clearTimeout(timeout);
  }
  
  return deactivate(keepLast);
};
