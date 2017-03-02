import _         from 'lodash';
import aptivator from '../../../lib/aptivator';
import vars      from '../../../lib/vars';

export default (stateName, immediate = false) => {
  let {transient} = vars.states.registry[stateName];
  let {delay, parallel = false, noResolves = false} = _.isObject(transient) ? transient : {};
  let stateParams = {stateName, owners: new Set(), flags: {parallel, transient: true, noResolves}};
  let transientConfigs = stateParams.transientConfigs = {};
  
  if(immediate) {
    delay = 0;
  } else if(!_.isNumber(delay)) {
    let {transientDelay} = vars.configs;
    delay = _.isNumber(transientDelay) ? transientDelay : vars.transientDelay;
  }
  
  transientConfigs.timeout = setTimeout(() => {
    let promise = aptivator.activate(stateParams);
    promise = promise.then(_.noop, e => Promise.reject(e));
    _.extend(transientConfigs, {promise});
    promise.catch(_.noop);
  }, delay);
  
  return stateParams;
};
