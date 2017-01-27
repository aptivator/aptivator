import aptivator from '../../lib/instance';

export default hookName => 
  async stateParams => {
    let suffixes = ['', `-${stateParams.stateName}`];
    let handles = suffixes.map(suffix => hookName + suffix);
    await aptivator.trigger(handles);
    return stateParams;
  };
