import _ from 'lodash';

export default (hookName, stateParams, results) => {
  _.extend(stateParams.flags, {[hookName]: true});
  
  if(_.isEmpty(results)) {
    return;
  }
  
  let {hooks} = stateParams;
  
  if(!hooks) {
    _.set(stateParams, 'hooks', hooks = {});
  }
  
  _.extend(hooks, results);
};
