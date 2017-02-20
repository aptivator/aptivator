import aptivator   from '../lib/instance';
import errorer     from '../errorer/errorer';
import registrar   from './registrar/registrar';
import deactivator from './deactivator/deactivator';

aptivator.deactivate = params => 
  registrar(params)
    .then(deactivator)
    .catch(errorer);
