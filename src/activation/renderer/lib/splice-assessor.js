export default (viewConfigs, stateParams) => {
  if(stateParams.flags.augment && viewConfigs.rendering.record.active) {
    return true;
  }
};
