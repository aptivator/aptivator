import _         from 'lodash';
import aptivator from '../../../lib/instance';
import vars      from '../../../lib/vars';

export default (stateName, stateParams) => {
  let {transient} = vars.states.registry[stateName];
  let transientConfigs = _.isObject(transient) ? transient : {};
  let owners = [_.cloneDeep(stateParams)];
  let currentOwners = new Set(owners);
  let params = {stateName, owners, currentOwners, flags: {parallel: false, transient: true}};
  let activation = {params};
  let {delay} = transientConfigs;
  
  /*
  if(_.isObject(transient)) {
    _.extend(params.flags, _.pick(transient, ['noResolves']));
  }
  */
  
  if(!_.isNumber(delay)) {
    let {transientDelay} = vars.configs;
    delay = _.isNumber(transientDelay) ? transientDelay : vars.transientDelay;
  }
  
  activation.timeout = setTimeout(() => {
    activation.promise = aptivator.activate(params);
    activation.promise = activation.promise.then(_.noop, e => Promise.reject(e));
    activation.promise.catch(_.noop);
  }, delay);

  return activation;
};
