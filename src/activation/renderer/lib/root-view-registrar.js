import _ from 'lodash';

export default (viewConfigs, stateParams) => {
  let rootViews = _.get(stateParams, 'rootViews');
  if(!rootViews) {
    _.set(stateParams, 'rootViews', rootViews = []);
  }
  
  rootViews.push(viewConfigs);
};
