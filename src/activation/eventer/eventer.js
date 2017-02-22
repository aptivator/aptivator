import _            from 'lodash';
import aptivator    from '../../lib/instance';
import hookResulter from '../../lib/hook-resulter';

let syncHookNames = ['start', 'loading'];

export default hookName => 
  stateParams => 
    new Promise((resolve, reject) => {
      let {stateName} = stateParams;
      let handle = `${hookName}:${stateName}`;
      let sync = syncHookNames.includes(hookName);
      
      if(!sync) {
        resolve(stateParams);
      }
      
      aptivator.trigger({handle, full: true}, stateParams).then(results => {
        _.extend(stateParams.flags, {[hookName]: true});
        
        hookResulter(stateParams, hookName, results);
        
        if(sync) {
          resolve(stateParams);
        }
      }, e => reject({errorType: e, stateParams}));
    });
