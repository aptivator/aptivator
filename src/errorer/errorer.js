import aptivator    from '../lib/aptivator';
import error        from '../lib/error';
import hookResulter from '../lib/hook-resulter';

export default async e => {
  if(!(e instanceof Error)) {
    let {type, message, stateParams = {}} = e;
    let {stateName} = stateParams;
    let eventName = 'error';
    let errorHandles = [`${eventName}:${type}`];
    let errorToPrint = error.message(`${type}${message ? ': ' + message : ''}`, 'errorer');
    
    if(stateName) {
      let handle = `${eventName}:${stateName}:${type}`;
      errorHandles.push({handle, full: true});
    }
    
    aptivator.trigger(errorHandles, type, stateParams).then(results => {
      if(stateName) {
        hookResulter(type, stateParams, results);
      }
    });
    
    console.log(`%c${errorToPrint}`, 'color: red');
  } else {
    console.error(e);  
  }
  
  throw e;
};
