import paramsAssembler from '../../../lib/params-assembler';

export default (callback, entityName, stateParams) => {
  if(callback.length) {
    var params = paramsAssembler(entityName, stateParams);
  }
  
  return callback(params);
};
