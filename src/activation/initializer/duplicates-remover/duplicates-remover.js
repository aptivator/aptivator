import _         from 'lodash';
import aptivator from '../../../lib/instance';
import error     from '../../../lib/error';

export default startedStates => {
  let serialStates = startedStates.filter(stateParams => !stateParams.flags.parallel);
  let serialStatesDuplicates = serialStates.reverse().slice(1);
  
  if(serialStatesDuplicates.length) {
    error.warn('included two serial states in an activation', 'initializer');
  }
  
  serialStates = _.difference(serialStates, serialStatesDuplicates);

  serialStatesDuplicates.forEach(stateParams => {
    _.extend(stateParams.flags, {active: false, canceled: true, pending: false, duplicateSerial: true});
  });
  
  startedStates = _.difference(startedStates, serialStatesDuplicates);
  
  if(serialStates.length) {
    let pendingSerialStateParams = aptivator.history.getOne(stateParams => {
      let {parallel, pending, canceled, transient, preprocessed} = stateParams.flags;
      if(!parallel && pending && !canceled && !transient && preprocessed) {
        return true;
      }
    });

    if(pendingSerialStateParams) {
      let {flags, transientStateParams, stateName} = pendingSerialStateParams;
      let {flags: transientFlags, stateName: transientStateName, owners} = transientStateParams;

      owners.delete(pendingSerialStateParams);
      
      if(!owners.size) {
        let {active} = transientFlags;
        if(!active) {
          _.extend(transientFlags, {canceled: true});
        }
        
        aptivator.deactivate({name: transientStateName, stateParams: transientStateParams, silent: !active});
      }
      
      _.extend(flags, {canceled: true});
      aptivator.deactivate({name: stateName, pendingSerialStateParams, silent: true});
    }
  }
  
  return startedStates;
};
