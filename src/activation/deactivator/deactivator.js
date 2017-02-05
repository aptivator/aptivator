import _         from 'lodash';
import aptivator from '../../lib/instance';
import canceler  from '../canceler/canceler';

let totalTransientConfigs = [];

export default stateParams => 
  new Promise(async (resolve, reject) => {
    try {
      canceler(stateParams);
    } catch(e) {
      return reject(e);
    }
    
    let {transient, parallel} = stateParams.flags;
    
    let activeStateParams = aptivator.history.getOne(stateParams => {
      let {active, parallel, transient} = stateParams.flags;
      if(active && !parallel && !transient) {
        return true;
      }
    });
    
    if(transient) {
      aptivator.on('transient-render', () => {
        let {stateName, flags} = activeStateParams || {};
        let {active} = flags || {};
        
        if(!parallel && active) {
          aptivator.deactivate({name: stateName, stateParams: activeStateParams});
        }
        
        setTimeout(() => resolve(stateParams));
      });
      
      let pendingTransients = aptivator.history.get(stateParams => {
        let {pending, canceled, transient, loading} = stateParams.flags;
        if(transient && pending && !loading && !canceled) {
          return true;
        }
      });
      
      if(!pendingTransients.length) {
        aptivator.trigger('transient-render');
        aptivator.off('transient-render');
      }
      
      return;
    }
    
    let {transientConfigs} = stateParams;
    let pendingRegulars = aptivator.history.get(stateParams => {
      let {pending, canceled, transient, loading} = stateParams.flags;
      if(pending && !transient && !loading && !canceled) {
        return true;
      }
    });
    
    if(transientConfigs && !totalTransientConfigs.includes(transientConfigs)) {
      totalTransientConfigs.push(transientConfigs);
    }
    
    aptivator.on('regular-render', () => {
      let {stateName, flags} = activeStateParams || {};
      let {active} = flags || {};
      
      if(!parallel && active) {
        aptivator.deactivate({name: stateName, stateParams: activeStateParams, silent: true});
      }
      
      setTimeout(() => resolve(stateParams));
    });
    
    if(!pendingRegulars.length) {
      let promisesMap = totalTransientConfigs.reduce((promisesMap, transientConfigs) => {
        let {promise, params, timeout} = transientConfigs;
        if(!promise) {
          clearTimeout(timeout);
        } else {
          promisesMap[params.stateName] = {promise, stateParams: params};
        }
        
        return promisesMap;
      }, {});
      
      let promises = _.map(promisesMap, valuesObj => valuesObj.promise);
      let transientStateNames = _.keys(promisesMap);
      
      await Promise.all(promises);
      
      transientStateNames.forEach(stateName => 
        aptivator.deactivate({name: stateName, stateParams: promisesMap[stateName].stateParams}));
      aptivator.trigger('regular-render');
      aptivator.off('regular-render');
      totalTransientConfigs = [];
    }
  });
