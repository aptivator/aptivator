import _                      from 'lodash';
import aptivator              from '../../lib/aptivator';
import serialStateDeactivator from './lib/serial-state-deactivator';

let eventHandles = _.mapValues({transient: '', regular: ''}, (value, key) => {
  return `aptivator-goto-render-${key}`;
});

export default stateParams => 
  new Promise(async (resolve, reject) => {
    stateParams.flags.prerendered = true;
    
    let {transient} = stateParams.flags;
    
    if(transient) {
      let eventHandle = eventHandles.transient;
      
      aptivator.once(eventHandle, () => resolve(stateParams));
      
      let query = {flags: {pending: true, transient: true, loading: false, canceled: false, prerendered: false}};
      let loadingTransients = aptivator.history.find(query);
      
      if(loadingTransients.length) {
        return;
      }
      
      query = {flags: {transient: true, pending: true, loading: true, canceled: false, parallel: false}};
      let serialTransients = aptivator.history.findOne(query);
      
      if(serialTransients) {
        await serialStateDeactivator();
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
        transientStates.delete(stateParams);
        clearTimeout(timeout);
      }
      
      return promises;
    }, []);

    await Promise.all(transientPromises);
    
    let deactivationPromises = [];
    
    transientStates.forEach(stateParams => {
      let promise = aptivator.deactivate({name: stateParams.stateName}).catch(_.noop);
      deactivationPromises.push(promise);
    });
    
    let serialRegular = _.find(loadedRegulars, {flags: {parallel: false}});
    
    if(!transientPromises.hasSerial && serialRegular) {
      let promise = serialStateDeactivator();
      deactivationPromises.push(promise);
    }

    await Promise.all(deactivationPromises);

    aptivator.trigger(eventHandle);
  });
