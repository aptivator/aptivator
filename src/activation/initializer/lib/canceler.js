import _         from 'lodash';
import aptivator from '../../../lib/instance';

export default function canceler(stateParams) {
  if(!canceler.promises) {
    _.extend(canceler, {promises: [], stateNames: []});
  }
  
  let {promises, stateNames} = canceler;
  
  if(!stateParams) {
    return promises;
  }
  
  let {stateName} = stateParams;
  
  if(stateNames.includes(stateName)) {
    return;
  }
  
  stateNames.push(stateName);
  
  let {flags, transientStateParams, parallels} = stateParams;
  let {owners} = transientStateParams || {};
  
  if(owners) {
    owners.delete(stateParams);
  }
  
  _.extend(flags, {canceled: true});
  
  if(flags.rendered) {
    _.extend(flags, {active: true});
    let promise = aptivator.deactivate({name: stateName}).catch(_.noop);
    promises.push(promise);
  }
  
  if(owners && !owners.size) {
    canceler(transientStateParams);
  }
  
  _.each(parallels, stateParams => canceler(stateParams));
  
  return promises;
}
