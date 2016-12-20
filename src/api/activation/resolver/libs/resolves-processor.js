import _ from 'underscore';

export default (resolves, resolveParams, storeKey, resolverParams) => 
  new Promise((resolve, reject) => {
    if(!resolves) { return resolve(); }
    
    let results = resolveParams[storeKey] || (resolveParams[storeKey] = {});
    let deps;
    let processedResolves = [];
    
    let storeResult = (resolve, resolveName, result) => {
      processedResolves.push(resolveName);
      if(resolve.persist || resolve.store) {
        results[resolveName] = result;
      }
    };
    
    !function processResolves(resolves) {
      let promises = [];
      let promiseNames = [];
      let dependents = {};
      
      _.each(resolves, (resolve, resolveName) => {
        if(resolve.persist && results[resolveName]) {
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
          return reject(`some dependencies specified for [${dependents}] resolve(s) are not found`);
        }
        
        processResolves((deps = dependents));
      });
    }(resolves);
  }); 
