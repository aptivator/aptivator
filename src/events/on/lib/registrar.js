import _         from 'lodash';
import aptivator from '../../../lib/aptivator';

import {eventRegistry, spaceSplitter} from '../../../lib/vars';

export default (events, callback, context, once) => {
  if(_.isString(events)) {
    events = events.trim().split(spaceSplitter);
  }
  
  if(!_.isArray(callback)) {
    callback = [{callback, context}];
  }

  callback = _.map(callback, callbackRecord => {
    callbackRecord = _.isFunction(callbackRecord) ? {callback: callbackRecord} : callbackRecord;
    return _.extend(callbackRecord, {once});
  });
  
  _.each(events, event => {
    let callbacks = eventRegistry[event] || (eventRegistry[event] = []);
    
    if(once) {
      let onceRemover = _.findIndex(callbacks, {onceRemover: true});
      if(onceRemover !== -1) {
        onceRemover = callbacks.splice(onceRemover, 1)[0];
      } else {
        let callback = function _ignore() {
          let onces = _.filter(callbacks, {once: true});
          
          _.each(onces, callbackRecord => {
            let {callback, context} = callbackRecord;
            aptivator.off(event, callback, context);
          });            
        };
        
        onceRemover = {callback, once: true, onceRemover: true};
      }
      
      callback.push(onceRemover);
    }
    
    callbacks.push(...callback);
  });  
};
