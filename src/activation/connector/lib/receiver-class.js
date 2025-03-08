import _       from 'lodash';
import errorer from '../../../errorer/errorer';

export default class {
  constructor(instance, receiver, receiverConfigs, params) {
    let {events = {}} = instance;
    let method = events[receiver] || receiver;
    _.extend(this, {data: {}, instance, method, receiverConfigs, params});
    return this.handler.bind(this);
  }

  handler(result, storeAs) {
    let {data, receiverConfigs, params, instance, method} = this;
    let {complete, reset} = receiverConfigs;
    let previous = Promise.resolve(data[storeAs]);
    let current = Promise.resolve(result);
    
    return previous.then(() => current).then(result => {
      data[storeAs] = result;
      
      if(complete) {
        if(_.keys(data).length < params.length) {
          return;
        }
        
        if(reset) {
          this.data = {};
        }
      }
      
      instance[method](data);
    }).catch(e => errorer({type: e})).catch(_.noop);
  }
}
