import aptivator   from '../lib/aptivator';
import errorer     from '../errorer/errorer';
import starter     from './starter/starter';
import deactivator from './deactivator/deactivator';

aptivator.deactivate = params => 
  starter(params)
    .then(deactivator)
    .catch(errorer);
