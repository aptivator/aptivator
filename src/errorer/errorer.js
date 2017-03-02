import aptivator    from '../lib/aptivator';
import error        from '../lib/error';
import hookResulter from '../lib/hook-resulter';

export default async e => {
  if(!(e instanceof Error)) {
    let {errorType, errorMessage, stateParams = {}} = e;
    let {stateName} = stateParams;
    let eventName = 'error';
    let errorHandles = [`${eventName}:${errorType}`];
    let errorToPrint = error.message(`${errorType}${errorMessage ? ': ' + errorMessage : ''}`, 'errorer');
    
    if(stateName) {
      let handle = `${eventName}:${stateName}:${errorType}`;
      errorHandles.push({handle, full: true});
    }
    
    aptivator.trigger(errorHandles, errorType, stateParams).then(results => {
      if(stateName) {
        hookResulter(errorType, stateParams, results);
      }
    });
    
    console.log(`%c${errorToPrint}`, 'color: red');
  } else {
    console.error(e);  
  }
  
  throw e;
};
