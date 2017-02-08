import aptivator              from '../../lib/instance';
import canceler               from '../canceler/canceler';
import serialStateDeactivator from './serial-state-deactivator/serial-state-deactivator';

let eventHandle = 'aptivator-goto-render-';

let eventHandles = ['transient', 'regular'].reduce((o, suffix) => {
  o[suffix] = `${eventHandle}${suffix}`;
  return o;
}, {}); 

let triggerer = (suffix) => {
  let handle = eventHandles[suffix];
  aptivator.trigger(handle);
  aptivator.off(handle);
};

export default stateParams => 
  new Promise(async (resolve, reject) => {
    try {
      canceler(stateParams);
    } catch(e) {
      return reject(e);
    }
    
    stateParams.flags.prerendered = true;
    
    let {transient} = stateParams.flags;
    
    if(transient) {
      aptivator.on(eventHandles['transient'], () => resolve(stateParams));
      
      let loadingTransients = aptivator.history.get(stateParams => {
        let {pending, canceled, transient, loading} = stateParams.flags;
        if(transient && pending && !loading && !canceled) {
          return true;
        }
      });
      
      if(loadingTransients.length) {
        return;
      }
      
      let serialTransients = aptivator.history.getOne(stateParams => {
        let {pending, canceled, transient, loading, parallel} = stateParams.flags;
        if(transient && pending && loading && !canceled && !parallel) {
          return true;
        }
      });
      
      if(serialTransients) {
        serialStateDeactivator();
      }
      
      triggerer('transient');
      
      return;
    }
    
    aptivator.on(eventHandles['regular'], () => resolve(stateParams));
    
    let loadingRegulars = aptivator.history.get(stateParams => {
      let {pending, canceled, transient, prerendered} = stateParams.flags;
      if(pending && !transient && !prerendered && !canceled) {
        return true;
      }
    });
    
    if(loadingRegulars.length) {
      return;
    }
    
    let loadedRegulars = aptivator.history.get(stateParams => {
      let {pending, canceled, transient, loading} = stateParams.flags;
      if(pending && !transient && loading && !canceled) {
        return true;
      }
    });
    
    let transientStates = loadedRegulars.reduce((transientStates, stateParams) => {
      return transientStates.add(stateParams.transientStateParams);
    }, new Set());
      
    let transientPromises = [...transientStates].reduce((promises, stateParams) => {
      let {parallel, transient} = stateParams.flags;
      let {promise, timeout} = transient || {};
      
      if(!parallel && promise) {
        promises.hasSerial = true;
      }
      
      if(promise) {
        promises.push(promise);
      } else {
        clearTimeout(timeout);
      }
      
      return promises;
    }, []);
    
    await Promise.all(transientPromises);
    
    transientStates.forEach(stateParams => {
      aptivator.deactivate({name: stateParams.stateName, stateParams});
    });
    
    if(!transientPromises.hasSerial) {
      serialStateDeactivator();
    }
    
    triggerer('regular');
  });
