import displayer         from '../../../lib/displayer';
import paramsAssembler   from '../../../lib/params-assembler';
import relations         from '../../../lib/relations';
import rootViewRegistrar from './root-view-registrar';

export default (viewConfigs, stateParams, cacheAssessor) => {
  let {addressStateName, uniqueAddress} = viewConfigs;
  
  if(!cacheAssessor.implicit.cache) {
    let cacheConfigs = cacheAssessor.explicit.cache;
    let {receiver} = cacheConfigs || {};
    
    if(receiver) {
      let {instance} = viewConfigs.record;
      let params = paramsAssembler(uniqueAddress, stateParams);
      instance[receiver](params);
    }
  }

  if(relations.isRoot(addressStateName)) {
    return rootViewRegistrar(viewConfigs, stateParams);
  }

  displayer(viewConfigs);
};
