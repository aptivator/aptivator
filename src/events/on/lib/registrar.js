import _         from 'lodash';
import aptivator from '../../../lib/instance';
import vars      from '../../../lib/vars';

let {eventRegistry, spaceSplitter} = vars;

export default (events, callback, context, once) => {
  if(_.isString(events)) {
    events = events.trim().split(spaceSplitter);
  }
  
  if(!_.isArray(callback)) {
    callback = [{callback, context}];
  }

  callback = _.map(callback, callbackRecord => {
    callbackRecord = _.isFunction(callbackRecord) ? {callback: callbackRecord} : callbackRecord;
    _.extend(callbackRecord.callback, {once});
    return callbackRecord;
  });
  
  _.each(events, event => {
    let callbacks = eventRegistry[event] || (eventRegistry[event] = []);
    let lastCallbackRecord = _.last(callbacks);
    
    if(once) {
      let {oncer} = lastCallbackRecord || {};
      if(oncer) {
        lastCallbackRecord = callbacks.splice(callbacks.length - 1)[0];
      } else {
        let callback = function _ignore() {
          let onces = _.filter(callbacks, callbackRecord => {
            return callbackRecord.callback.once;
          });
          
          _.each(onces, callbackRecord => {
            let {callback, context} = callbackRecord;
            aptivator.off(event, callback, context);
          });            
        };
        
        callback.once = true;
        
        lastCallbackRecord = {callback, oncer: true};
      }
      
      callback.push(lastCallbackRecord);
    }
    
    callbacks.push(...callback);
  });  
};
