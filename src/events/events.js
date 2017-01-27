import _         from 'lodash';
import aptivator from '../lib/instance';

let events = {};

_.extend(aptivator, {
  on(name, callback, context) {
    let handlers = events[name] || (events[name] = []);
    handlers.push({callback, context});
  },
  
  has(handle) {
    return events[handle];
  },
  
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
