import _                from 'lodash';
import error            from '../../lib/error';
import callbacker       from '../callbacker/callbacker';

export default (events, ...args) => {
  let promises = [];
  let results = {};

  callbacker(events, args).forEach(eventRecord => {
    let {args, handle, callbacks} = eventRecord;
    let handlePath = handle.split(':').concat('v');
    let store = {};
    
    callbacks.forEach(callbackRecord => {
      let {callback, context} = callbackRecord;
      let {name} = callback;
      let result = callback.apply(context, args);
      
      result = Promise.resolve(result);
      result = result.then(result => {
        if(name) {
          if(!_.has(results, handlePath)) {
            _.set(results, handlePath, store);
          }
          
          if(_.has(store, name)) {
            error.throw(`function [${name}] was already called for [${handle}] event`, 'event triggerer');
          }
          
          _.set(store, name, result);
        }
      });
      
      promises.push(result);
    });
  });
  
  return Promise.all(promises).then(() => results);
};
