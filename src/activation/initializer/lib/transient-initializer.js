import _                       from 'lodash';
import aptivator               from '../../../lib/instance';
import vars                    from '../../../lib/vars';

export default stateName => {
  let {transient} = vars.states.registry[stateName];
  let transientConfigs = _.isObject(transient) ? transient : {};
  let baseParams = {keepLast: false, overlay: false};
  let setParams = _.pick(transientConfigs, _.keys(baseParams));
  let immutableParams = {noHistory: true, name: stateName};
  let activation = {params: _.extend(baseParams, setParams, immutableParams)};
  let {delay} = transientConfigs;
  
  if(!_.isNumber(delay)) {
    let {transientDelay} = vars.configs;
    delay = _.isNumber(transientDelay) ? transientDelay : vars.transientDelay;
  }
  
  activation.timeout = setTimeout(() => {
    activation.promise = aptivator.activate(activation.params);
    activation.promise = activation.promise.then(_.noop, e => Promise.reject(e));
    activation.promise.catch(_.noop);
  }, delay);

  return activation;
};
