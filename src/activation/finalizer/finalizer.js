import _        from 'lodash';
import canceler from '../canceler/canceler';

export default async stateParams => {
  canceler(stateParams);
  
  _.extend(stateParams.flags, {pending: false, active: true});
  
  if(stateParams.time) {
    console.log(`%cruntime: ${_.now() - stateParams.time}ms`, 'color: green;');
  }

  delete stateParams.time;

  return stateParams;
};
