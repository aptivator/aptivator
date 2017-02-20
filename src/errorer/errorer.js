import _         from 'lodash';
import aptivator from '../lib/instance';
import error     from '../lib/error';

export default async e => {
  let errorToPrint = e;
  
  if(!(e instanceof Error)) {
    let {errorType, errorMessage, stateParams = {}} = e;
    let {stateName} = stateParams;
    let eventName = 'error';
    let errorHandles = [`${eventName}:${errorType}`];
    errorToPrint = error.message(`${errorType}: ${errorMessage}`, 'errorer');
    
    if(stateName) {
      let handle = `${eventName}:${stateName}:${errorType}`;
      errorHandles.push({handle, full: true});
    }
    
    aptivator.trigger(errorHandles, errorType, stateParams).then(results => {
      if(stateName) {
        _.extend(stateParams.hooks, results);
        _.extend(stateParams.flags, {[errorType]: true});
      }
    });
  } 
  
  console.log(`%c${errorToPrint}`, 'color: red');
  
  throw e;
};
