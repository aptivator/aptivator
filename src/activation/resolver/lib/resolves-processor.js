import _     from 'lodash';
import error from '../../../lib/error';

export default (resolves, resolveParams, storeKey, resolverParams) => 
  new Promise((resolve, reject) => {
    if(!resolves) { 
      return resolve();
    }
    
    let deps;
    let processedResolves = [];
    let results = resolveParams[storeKey] || (resolveParams[storeKey] = {});
    
    let storeResult = (resolve, resolveName, result) => {
      resolve.processed = true;
      processedResolves.push(resolveName);
      if(resolve.store) {
        results[resolveName] = result;
      }
    };
    
    !function processResolves(resolves) {
      let promises = [];
      let promiseNames = [];
      let dependents = {};
      
      _.each(resolves, (resolve, resolveName) => {
        if(resolve.persist && resolve.processed) {
          return processedResolves.push(resolveName);
        }
        
        if(resolve.deps) {
          if(_.difference(resolve.deps, processedResolves).length) {
            return dependents[resolveName] = resolve;
          }
          
          _.extend(resolverParams.resolves, _.pick(resolveParams[storeKey], resolve.deps));
        }
        
        let result = resolve.resolver(resolverParams);
        
        if(result instanceof Promise) {
          promiseNames.push(resolveName);
          return promises.push(result);
        }
        
        storeResult(resolve, resolveName, result);
      });
      
      Promise.all(promises).then(data => {
        data.forEach((result, index) => {
          let resolveName = promiseNames[index];
          let resolve = resolves[resolveName];
          
          storeResult(resolve, resolveName, result);
        });
        
        if(!_.keys(dependents).length) {
          return resolve();
        }
        
        if(deps && _.isEqual(deps, dependents)) {
          dependents = _.keys(dependents).join(', ');
          error.throw(`some dependencies specified for [${dependents}] resolve(s) are not found`, 'resolver');
        }
        
        processResolves((deps = dependents));
      }).catch(reject);
    }(resolves);
  }); 
