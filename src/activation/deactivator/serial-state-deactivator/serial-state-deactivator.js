import aptivator from '../../../lib/instance';

export default () => {
  let activeStateParams = aptivator.history.getOne(stateParams => {
    let {active, parallel, transient} = stateParams.flags;
    if(active && !parallel && !transient) {
      return true;
    }
  });
  
  if(activeStateParams) {
    aptivator.deactivate({name: activeStateParams.stateName, stateParams: activeStateParams});
  }
};
