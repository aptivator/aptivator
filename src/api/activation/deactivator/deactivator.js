import aptivator from '../../../lib/instance';

export default stateParams =>
  new Promise(resolve => {
    let lastStateParams = aptivator.history.last();
    
    if(lastStateParams) {
      console.log(`last state: ${lastStateParams.stateName}`);
    }
    
    resolve(stateParams);    
  });
