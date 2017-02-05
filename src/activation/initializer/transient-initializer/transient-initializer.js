import _         from 'lodash';
import aptivator from '../../../lib/instance';
import vars      from '../../../lib/vars';

export default stateName => {
  let {transient} = vars.states.registry[stateName];
  let {delay} = _.isObject(transient) ? transient : {};
  let stateParams = {stateName, owners: new Set(), flags: {parallel: false, transient: {}}};
  let transientConfigs = stateParams.flags.transient;
  
  if(!_.isNumber(delay)) {
    let {transientDelay} = vars.configs;
    delay = _.isNumber(transientDelay) ? transientDelay : vars.transientDelay;
  }
  
  if(_.isObject(transient)) {
    _.extend(stateParams.flags, _.pick(transient, ['noResolves']));
  }
  
  transientConfigs.timeout = setTimeout(() => {
    let promise = aptivator.activate(stateParams);
    promise = promise.then(_.noop, e => Promise.reject(e));
    _.extend(transientConfigs, {promise});
    promise.catch(_.noop);
  }, delay);
  
  return stateParams;
};
