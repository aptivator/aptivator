import _         from 'lodash';
import aptivator from '../../lib/instance';

export default eventName => 
  async stateParams => {
    let handle = `${eventName}:${stateParams.stateName}`;
    let results = await aptivator.trigger({handle, full: true}, stateParams);
    
    _.extend(stateParams.hooks, results);
    _.extend(stateParams.flags, {[eventName]: true});
    return stateParams;
  };
