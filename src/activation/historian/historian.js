import historyAdder from '../../history/history-adder';

export default stateParams => {
  if(!stateParams.noHistory) {
    historyAdder(stateParams);
  }
  
  return stateParams;
};
