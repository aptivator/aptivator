import _            from 'lodash';
import approximator from '../../lib/approximator';
import aptivator    from '../../lib/instance';
import error        from '../../lib/error';
import fragment     from '../../lib/fragment';
import route        from '../../lib/route';
import vars         from '../../lib/vars';
import dataStores   from './lib/data-stores';

let {configs, states} = vars;
let {registry} = states;

export default stateParams => 
  new Promise((resolve, reject) => {
    stateParams.directParams = stateParams.direct;
    stateParams.routeParams = stateParams.route;
    stateParams.stateName = stateParams.name;
    
    delete stateParams.useResolves;
    
    let {stateName, routeParams, routeValues, silent} = stateParams;
    let stateConfigs = registry[stateName];
    
    if(configs.showRuntime && !stateConfigs.transient) {
      stateParams.time = Date.now();
    }
  
    if(!stateConfigs) {
      error.throw(`invalid [${stateName}] state name`, 'initializer');
    }
    
    if(_.isObject(stateConfigs.transient)) {
      _.extend(stateParams, _.pick(stateConfigs.transient, ['noResolves']));
    }
    
    let transientStateName = approximator.fromStateName('transient', stateName);
    
    if(transientStateName && transientStateName !== stateName) {
      let activationPromise = {promise: undefined};
      let defaults = {keepLast: false, overlay: false};
      let immutableDefaults = {noHistory: true, name: transientStateName};
      let transientStateConfigs = registry[transientStateName];
      let {transient} = transientStateConfigs;
      let transientConfigs = _.isObject(transient) ? transient : {};
      let delay = _.isNumber(transientConfigs.delay) ? transientConfigs.delay : _.isNumber(configs.transientDelay) ? configs.transientDelay : 300;
      let activationParams = _.extend(defaults, _.pick(transientConfigs, _.keys(defaults)), immutableDefaults);
      let timeoutHandle = setTimeout(() => (activationPromise.promise = aptivator.activate(activationParams).then(_.noop, e => Promise.reject(e))).catch(_.noop), delay);
      
      stateParams.transient = {activationPromise, activationParams, timeoutHandle};
    }
  
    if(!routeValues) {
      routeValues = stateConfigs.routeValues;
    }
  
    if(!stateConfigs.route) {
      silent = true;
    }
    
    if(!routeParams || _.isEmpty(routeParams)) {
      stateParams.routeParams = route.parts.assemble(stateName, routeValues);
      
      if(!silent) {
        fragment.set(stateParams.routeParams.fragment);
      }
    }
    
    _.extend(stateParams, dataStores);
    
    resolve(stateParams);
  });
