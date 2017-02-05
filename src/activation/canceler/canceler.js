export default stateParams => {
  let {undeclared, duplicateSerial, canceled} = stateParams.flags;
  
  if(undeclared) {
    throw 'undeclared';
  }
  
  if(duplicateSerial) {
    throw 'duplicate-serial';
  }
  
  if(canceled) {
    throw 'canceled';
  }
  
  return stateParams;
};
