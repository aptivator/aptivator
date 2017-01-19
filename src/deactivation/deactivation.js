import aptivator   from '../lib/instance';
import error       from '../lib/error';
import deactivator from './lib/deactivator'; 

aptivator.deactivate = params => {
  let {forward, focal} = params;
  
  if(forward && focal) {
    error.throw(`use either [focal] or [forward] flag`, 'deactivator');
  }
  
  if(focal || forward) {
    return deactivator.partial(params);
  }
  
  deactivator.full(params);
};
