import aptivator     from '../../lib/instance';

export default stateParams =>
  new Promise(resolve => {
    let {stateName} = aptivator.history.last() || {};
    
    if(stateName) {
      aptivator.deactivate({name: stateName});
    }
    
    resolve(stateParams);    
  });
