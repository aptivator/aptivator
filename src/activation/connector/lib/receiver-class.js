import _ from 'lodash';

export default class {
  constructor(instance, receiver, receiverConfigs, params) {
    let {events = {}} = instance;
    let method = events[receiver] || receiver;
    
    _.extend(this, {
      data: {}, 
      types: {},
      instance, 
      method, 
      receiverConfigs, 
      params
    });
    
    return this.handler.bind(this);
  }
  
  static rejector(error) {
    throw error;
  }
  
  resolver(result, storeAs) {
    let {data, receiverConfigs, instance, params, method} = this;
    let {complete, reset} = receiverConfigs;
    
    data[storeAs] = result;
    
    if(complete) {
      if(_.keys(data).length < params.length) {
        return;
      }
      
      if(reset) {
        setTimeout(() => this.data = {});
      }
    }
    
    instance[method].call(instance, data);
  }
  
  handler(storeAs, result) {
    let {types, resolver, rejector} = this;
    resolver = resolver.bind(this);
    
    if(result instanceof Promise) {
      let promise = result.then(result => resolver(result, storeAs));
      
      if(types[storeAs] instanceof Promise) {
        return types[storeAs] = types[storeAs].then(promise).catch(rejector);
      }
      
      return types[storeAs] = result.then(promise).catch(rejector);
    }
    
    resolver(result, storeAs);
  }
}
