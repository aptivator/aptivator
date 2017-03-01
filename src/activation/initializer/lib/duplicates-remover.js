import _         from 'lodash';
import aptivator from '../../../lib/instance';
import canceler  from './canceler';

export default async startedStates => {
  let serialStates = _.filter(startedStates, {flags: {parallel: false}});
  let serialStatesDuplicates = serialStates.reverse().slice(1);
  
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
  let promises = canceler(pendingSerialState);
  
  await Promise.all(promises);
  
  return startedStates;
};
