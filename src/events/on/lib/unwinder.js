import _         from 'lodash';
import aptivator from '../../../lib/aptivator';

export default (eventsConfigs, handlePartsBase, once) => {
  _.each(eventsConfigs, (configs, eventName) => {
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
