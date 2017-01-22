import _ from 'lodash';

export default stateParams => {
  if(stateParams.time) {
    console.log(`%cruntime: ${_.now() - stateParams.time}ms`, 'color: green;');
  }
};
