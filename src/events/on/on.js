import _         from 'lodash';
import aptivator from '../../lib/instance';
import vars      from '../../lib/vars';

let {eventRegistry, spaceSplitter} = vars;

export default (events, callback, context, once) => {
  if(_.isString(events) || _.isArray(events)) {
    if(_.isString(events)) {
      events = events.trim().split(spaceSplitter);
    }
    
    if(!_.isArray(callback)) {
      callback = [{callback, context}];
    }

    callback = callback.map(callbackRecord => {
      callbackRecord = _.isFunction(callbackRecord) ? {callback: callbackRecord} : callbackRecord;
      let {callback, context} = callbackRecord;
      
      if(once) {
        let oncer = _.once(function(...args) {
          aptivator.off(events, oncer, context);
          return callback.apply(this, args);
        });
        
        callbackRecord.callback = oncer;
      }
      
      return callbackRecord;
    });
    
    return events.forEach(event => {
      let callbacks = eventRegistry[event] || (eventRegistry[event] = []);
      callbacks.push(...callback);
    });
  }

  let configs = events;
  let handlePartsBase = callback || [];
  
  _.each(configs, (configs, eventName) => {
    let {callbacks} = configs;
    let handleParts = handlePartsBase.concat(eventName);
    
    if(_.isArray(configs)) {
      callbacks = configs;
    } else if(_.isFunction(configs) || _.has(configs, 'callback')) {
      callbacks = [configs];
    } else if(_.isFunction(callbacks) || _.has(callbacks, 'callback')) {
      callbacks = [callbacks];
    }
    
    if(callbacks) {
      let handleName = handleParts.join(':');
      aptivator.on(handleName, callbacks, null, once);
    }
    
    if(_.isPlainObject(configs)) {
      let childrenConfigs = _.omit(configs, 'callbacks');
      if(!_.isEmpty(childrenConfigs)) {
        aptivator.on(childrenConfigs, handleParts, null, once);
      }
    }
  });
};
