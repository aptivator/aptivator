import _         from 'lodash';
import aptivator from '../../lib/instance';

export default stateParams => 
  new Promise(resolve => {
    if(!stateParams.noHistory) {
      aptivator.history.add(_.cloneDeep(stateParams));
    }
    
    resolve(stateParams);
  });
