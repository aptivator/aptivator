import _         from 'lodash';
import aptivator from '../../../lib/instance';
import error     from '../../../lib/error';

export default async startedStates => {
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
  
  if(!serialStates.length) {
    return startedStates;
  }
  
  let query = {flags: {parallel: false, pending: true, canceled: false, transient: false, preprocessed: true}};
  let pendingSerialState = aptivator.history.findOne(query);

  let deactivationPromises = [];
  let taggedStateNames = [];

  !function canceler(stateParams = pendingSerialState) {
    if(!stateParams) {
      return;
    }
    
    let {stateName} = stateParams;
    
    if(taggedStateNames.includes(stateName)) {
      return;
    }
    
    taggedStateNames.push(stateName);
    
    let {flags, transientStateParams, parallels} = stateParams;
    let {owners} = transientStateParams || {};
    
    if(owners) {
      owners.delete(stateParams);
    }
    
    _.extend(flags, {canceled: true});
    
    console.log(`clearing ${stateName}`);
    
    if(flags.rendered) {
      _.extend(flags, {active: true});
      let promise = aptivator.deactivate({name: stateName}).catch(_.noop);
      deactivationPromises.push(promise);
    }
    
    if(owners && !owners.size) {
      canceler(transientStateParams);
    }
    
    _.each(parallels, stateParams => canceler(stateParams));
  }();

  await Promise.all(deactivationPromises);
  
  return startedStates;
};
