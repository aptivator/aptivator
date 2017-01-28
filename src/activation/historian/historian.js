import historyAdder from '../../history/history-adder';

export default async stateParams => {
  if(!stateParams.noHistory) {
    historyAdder(stateParams);
  }
  
  return stateParams;
};
