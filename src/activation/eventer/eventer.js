import aptivator    from '../../lib/aptivator';
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
        hookResulter(hookName, stateParams, results);
        
        if(sync) {
          return resolve(stateParams);
        }
      }, e => reject({type: e, stateParams}));
    });
