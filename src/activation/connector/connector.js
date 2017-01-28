import canceler from '../canceler/canceler';

export default stateParams => {
  canceler(stateParams);

  return stateParams;  
};
