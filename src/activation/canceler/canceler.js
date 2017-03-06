import error from '../../lib/error';

let moduleName = 'canceler';

export default stateParams => {
  let {stateName} = stateParams;
  let {duplicateSerial, canceled} = stateParams.flags;
  
  if(duplicateSerial) {
    return !error.warn(`state [${stateName}] is serial and cannot be activated with another serial state`, moduleName);
  }
  
  if(canceled) {
    return !error.warn(`state [${stateName}] was canceled`, moduleName);
  }
};
