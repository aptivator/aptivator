import aptivator     from '../../lib/instance';

export default stateParams =>
  new Promise((resolve, reject) => {
    let {transient, keepLast} = stateParams;
    let {stateName: lastStateName} = aptivator.history.prev() || {};
    let deactivate = (keepLast = keepLast) => {
      if(!keepLast && lastStateName) {
        aptivator.deactivate({name: lastStateName});
      }
      resolve(stateParams);
    };
    
    let _deactivate = deactivate;
    let {activation} = transient || {activation: {}};
    
    if(activation.promise instanceof Promise) {
      deactivate = () => {
        let {keepLast, name} = activation.params;
        aptivator.deactivate({name});
        _deactivate(!keepLast);
      };
    } else {
      activation.promise = Promise.resolve();
      deactivate = () => {
        clearTimeout(activation.timeout);
        _deactivate();
      };
    }
    
    activation.promise.then(deactivate).catch(reject);
  });
