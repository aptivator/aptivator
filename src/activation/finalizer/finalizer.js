import _ from 'lodash';

export default stateParams => {
  _.extend(stateParams.flags, {pending: false, active: true});
  
  if(stateParams.time) {
    console.log(`%cruntime: ${_.now() - stateParams.time}ms`, 'color: green;');
    delete stateParams.time;
  }
  
  return stateParams;
};
