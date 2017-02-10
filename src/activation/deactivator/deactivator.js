import _                      from 'lodash';
import aptivator              from '../../lib/instance';
import serialStateDeactivator from './serial-state-deactivator/serial-state-deactivator';

let eventHandles = ['transient', 'regular'].reduce((o, suffix) => {
  o[suffix] = `aptivator-goto-render-${suffix}`;
  return o;
}, {});

export default stateParams => 
  new Promise(async (resolve, reject) => {
    stateParams.flags.prerendered = true;
    
    let {transient} = stateParams.flags;
    
    if(transient) {
      let eventHandle = eventHandles.transient;
      
      aptivator.once(eventHandle, () => resolve(stateParams));
      
      let query = {flags: {pending: true, transient: true, loading: false, canceled: false}};
      let loadingTransients = aptivator.history.find(query);
      
      if(loadingTransients.length) {
        return;
      }
      
      query = {flags: {transient: true, pending: true, loading: true, canceled: false, parallel: false}};
      let serialTransients = aptivator.history.findOne(query);
      
      if(serialTransients) {
        serialStateDeactivator();
      }
      
      return aptivator.trigger(eventHandle);
    }
    
    let eventHandle = eventHandles.regular;
    
    aptivator.once(eventHandle, () => resolve(stateParams));
    
    let query = {flags: {pending: true, transient: false, prerendered: false, canceled: false}};
    let loadingRegulars = aptivator.history.find(query);
    
    if(loadingRegulars.length) {
      return;
    }
    
    query = {flags: {pending: true, transient: false, canceled: false, loading: true}};
    let loadedRegulars = aptivator.history.find(query);
    
    let transientStates = loadedRegulars.reduce((transientStates, stateParams) => {
      return transientStates.add(stateParams.transientStateParams);
    }, new Set());
      
    let transientPromises = [...transientStates].reduce((promises, stateParams) => {
      let {promise, timeout} = stateParams.transientConfigs || {};
      
      if(!stateParams.flags.parallel && promise) {
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
    
    let serialRegular = _.find(loadedRegulars, {flags: {parallel: false}});
    
    if(!transientPromises.hasSerial && serialRegular) {
      serialStateDeactivator();
    }
    
    aptivator.trigger(eventHandle);
  });
