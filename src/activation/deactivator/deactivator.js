import aptivator     from '../../lib/instance';

export default stateParams =>
  new Promise((resolve, reject) => {
    let {transient, keepLast} = stateParams;
    let {stateName: lastStateName} = aptivator.history.prev() || {};

    if(transient) {
      let {activationParams, activationPromise, timeoutHandle} = transient;
      if(!(activationPromise.promise instanceof Promise)) {
        clearTimeout(timeoutHandle);
        lastStateName && aptivator.deactivate({name: lastStateName, ignoreMultiple: true});
        resolve(stateParams);
      } else {
        activationPromise.promise.then(() => {
          let {keepLast, name} = activationParams;

          aptivator.deactivate({name, ignoreMultiple: true});
          
          if(keepLast && lastStateName) {
            aptivator.deactivate({name: lastStateName});
          }
          
          resolve(stateParams);
        }).catch(reject);
      }
    } else {
      if(!keepLast && lastStateName) {
        aptivator.deactivate({name: lastStateName, ignoreMultiple: true});
      }
      
      resolve(stateParams);
    }
  });
