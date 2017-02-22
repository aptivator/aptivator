import _ from 'lodash';

export default (stateParams, hookName, results) => {
  if(_.isEmpty(results)) {
    return;
  }
  
  let hookValues = _.get(results, [hookName, 'v'], {});
  let hookStateValues = _.get(results, [hookName, stateParams.stateName, 'v'], {});
  results[hookName] = _.merge(hookValues, hookStateValues);
  
  if(!stateParams.hooks) {
    stateParams.hooks = {};
  }
  
  _.merge(stateParams.hooks, results);
};
