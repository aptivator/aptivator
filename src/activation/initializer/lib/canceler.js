import _         from 'lodash';
import aptivator from '../../../lib/instance';

export default function canceler(stateParams, promises = [], stateNames = []) {
  if(!stateParams) {
    return promises;
  }
  
  let {stateName} = stateParams;
  
  if(stateNames.includes(stateName)) {
    return promises;
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
    canceler(transientStateParams, promises, stateNames);
  }
  
  _.each(parallels, stateParams => canceler(stateParams, promises, stateNames));
  
  return promises;
}
