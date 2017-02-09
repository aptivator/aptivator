import _         from 'lodash';
import aptivator from '../../../lib/instance';
import error     from '../../../lib/error';

export default startedStates => {
  let serialStates = _.filter(startedStates, {flags: {parallel: false}});
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
    let query = {flags: {parallel: false, pending: true, canceled: false, transient: false, preprocessed: true}};
    let pendingSerialState = aptivator.history.findOne(query);

    if(pendingSerialState) {
      let {flags, transientStateParams, stateName} = pendingSerialState;
      let {flags: transientFlags, stateName: transientStateName, owners} = transientStateParams;

      owners.delete(pendingSerialState);
      
      if(!owners.size) {
        let {active} = transientFlags;
        if(!active) {
          _.extend(transientFlags, {canceled: true});
        }
        
        aptivator.deactivate({name: transientStateName, stateParams: transientStateParams, silent: !active});
      }
      
      _.extend(flags, {canceled: true});
      aptivator.deactivate({name: stateName, stateParams: pendingSerialState, silent: true});
    }
  }
  
  return startedStates;
};
