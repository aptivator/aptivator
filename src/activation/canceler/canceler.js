export default stateParams => {
  let {stateName} = stateParams;
  let {duplicateSerial, canceled} = stateParams.flags;
  
  if(duplicateSerial) {
    throw {
      type: 'duplicate',
      message: `state [${stateName}] is serial and cannot be activated with another serial state`,
      stateParams
    };
  }
  
  if(canceled) {
    throw {
      type: 'canceled',
      message: `state [${stateName}] was canceled`,
      stateParams
    };
  }
};
