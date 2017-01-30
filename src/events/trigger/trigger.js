import _                from 'lodash';
import error            from '../../lib/error';
import vars             from '../../lib/vars';
import triggerSequencer from './trigger-sequencer/trigger-sequencer';

let {eventSplitter} = vars;

export default (events, ...args) => {
  if(_.isString(events)) {
    events = events.split(eventSplitter);
  }

  let promises = [];
  let results = {};
  let triggerSequence = triggerSequencer(events, args);
  
  triggerSequence.forEach(record => {
    let {args, handle, callbacks} = record;
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
