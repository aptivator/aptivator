import _                  from 'lodash';
import aptivator          from '../lib/instance';
import configsTransformer from './lib/configs-transformer';

let events = {};

_.extend(aptivator, {
  on(configs, master = events) {
    if(_.isString(configs)) {
      configs = configsTransformer(configs, master);
      return this.on(configs);
    }
    
    _.each(configs, (configs, eventName) => {
      let eventConfigs = master[eventName] || (master[eventName] = {});
      let {callbacks} = configs;
      
      if(_.isFunction(configs)) {
        callbacks = [configs];
      } else if(_.isArray(configs)) {
        callbacks = configs;
      } else if(_.isFunction(callbacks)) {
        callbacks = [callbacks];
      }
      
      if(callbacks) {
        let eventCallbacks = eventConfigs.callbacks || (eventConfigs.callbacks = []);
        eventCallbacks.splice(eventCallbacks.length, 0, ...callbacks);
      }
      
      if(configs.sub) {
        eventConfigs.sub || (eventConfigs.sub = {});
        this.on(configs.sub, eventConfigs.sub);
      }
    });
  },
  
  trigger(configs, ...args) {
    
  },
  
  events() {
    return events;
  }
});


_.extend(aptivator, {
  trigger(name, ...args) {
    let promises = [];
    let results = {};
    let names = _.isString(name) ? [name] : name;
    
    names.forEach(name =>
      _.each(events[name], handler => {
        let {callback, context} = handler;
        let callbackName = callback.name;
        let result = callback.apply(context, args);
        result = Promise.resolve(result);
        result = result.then(result => {
          if(callbackName) {
            results[callbackName] = result;
          }
        });
        
        promises.push(result);
      }));
    
    return Promise.all(promises).then(() => results);
  }
});
