export default stateParams => {
  if(stateParams.cancel) {
    throw 'cancel';
  }
  return stateParams;
};
