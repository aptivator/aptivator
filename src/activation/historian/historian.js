import historyAdder from '../../history/history-adder';

export default async stateParams => {
  historyAdder(stateParams);
  return stateParams;
};
