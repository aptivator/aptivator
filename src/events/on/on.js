import _         from 'lodash';
import aptivator from '../../lib/instance';
import vars      from '../../lib/vars';

let {eventRegistry, eventSplitter} = vars;

export default (events, callback, context) => {
  if(_.isString(events) || _.isArray(events)) {
    if(_.isString(events)) {
      events = events.split(eventSplitter);
    }
    
    if(!_.isArray(callback)) {
      callback = [{callback, context}];
    }
    
    callback = callback.map(callback => _.isFunction(callback) ? {callback} : callback);
    
    return events.forEach(event => {
      let callbacks = eventRegistry[event] || (eventRegistry[event] = []);
      callbacks.splice(callbacks.length, 0, ...callback);
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
      aptivator.on(handleName, callbacks);
    }
    
    if(configs.sub) {
      aptivator.on(configs.sub, handleParts);
    }
  });
};
