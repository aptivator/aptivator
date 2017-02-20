export default stateParams => {
  let {stateName} = stateParams;
  let {duplicateSerial, canceled} = stateParams.flags;
  
  if(duplicateSerial) {
    throw {
      errorType: 'duplicate-serial',
      errorMessage: `state [${stateName}] is serial and cannot be activated with another serial state`,
      stateParams
    };
  }
  
  if(canceled) {
    throw {
      errorType: 'canceled',
      errorMessage: `state [${stateName}] was canceled`,
      stateParams
    };
  }
};
