import _            from 'lodash';
import historyAdder from '../../history/adder';

export default stateParams => {
  if(!stateParams.noHistory) {
    historyAdder(_.cloneDeep(_.pick(stateParams, ['stateName'])));
  }
  
  return stateParams;
};
