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
  
  let deactivationPromises = [];
  
  if(serialStates.length) {
    let query = {flags: {parallel: false, pending: true, canceled: false, transient: false, preprocessed: true}};
    let pendingSerialState = aptivator.history.findOne(query);

    if(pendingSerialState) {
      let {flags, transientStateParams, stateName} = pendingSerialState;
      let {flags: transientFlags, stateName: transientStateName, owners} = transientStateParams;

      owners.delete(pendingSerialState);
      
      if(!owners.size) {
        let {active, rendered} = transientFlags;
        if(!active) {
          let flagsUpdate = {canceled: true};
          
          if(rendered) {
            _.extend(flagsUpdate, {active: true});
          }
          
          _.extend(transientFlags, flagsUpdate);
        }
        
        if(rendered) {
          let promise = aptivator.deactivate({name: transientStateName}).catch(_.noop);
          deactivationPromises.push(promise);
        }
      }
      
      _.extend(flags, {canceled: true});
      
      if(flags.rendered) {
        _.extend(flags, {active: true});
        let promise = aptivator.deactivate({name: stateName}).catch(_.noop);
        deactivationPromises.push(promise);
      }
    }
  }
  
  return Promise.all(deactivationPromises).then(() => startedStates);
};
