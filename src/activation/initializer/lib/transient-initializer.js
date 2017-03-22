import _         from 'lodash';
import aptivator from '../../../lib/aptivator';

import {configs, registry, transientDelay} from '../../../lib/vars';

export default (stateName, immediate) => {
  let stateParams = stateName;
  
  if(!_.isObject(stateParams)) {
    let {transient} = registry[stateName];
    var {delay, parallel = false, noResolves = false} = _.isObject(transient) ? transient : {};
    stateParams = {stateName, flags: {parallel, transient: true, noResolves}};
  }
  
  _.extend(stateParams, {owners: new Set()});
  
  let transientConfigs = stateParams.transientConfigs = {};
  
  if(immediate) {
    delay = 0;
  } else if(!_.isNumber(delay)) {
    let {transientDelay: transientDelay_} = configs;
    delay = _.isNumber(transientDelay_) ? transientDelay_ : transientDelay;
  }
  
  transientConfigs.timeout = setTimeout(() => {
    let promise = aptivator.activate(stateParams);
    promise = promise.then(_.noop, e => Promise.reject(e));
    _.extend(transientConfigs, {promise});
    promise.catch(_.noop);
  }, delay);
  
  return stateParams;
};
