import canceler from '../canceler/canceler';

export default async stateParams => {
  canceler(stateParams);
  
  return stateParams;
};
