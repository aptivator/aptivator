import _         from 'lodash';
import aptivator from '../../lib/instance';

export default stateParams => {
  if(!stateParams.noHistory) {
    aptivator.history.add(_.cloneDeep(stateParams));
  }
  
  return stateParams;
};
