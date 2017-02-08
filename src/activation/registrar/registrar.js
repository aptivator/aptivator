import historyAdder from '../../history/history-adder';

export default async stateParams => { 
  if(!stateParams.flags) {
    stateParams.flags = {};
  }
  
  if(stateParams.name) {
    stateParams.stateName = stateParams.name;
    delete stateParams.name;
  }
  
  stateParams.hooks = {};
  historyAdder(stateParams);
  
  return stateParams;
};
