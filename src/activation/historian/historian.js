import _            from 'lodash';
import historyAdder from '../../history/history-adder';

export default stateParams => {
  if(!stateParams.noHistory) {
    historyAdder(_.cloneDeep(stateParams));
  }
  
  return stateParams;
};
