import deactivator from './lib/deactivator';

export default params => {
  let {focal, forward} = params;
  let method = focal || forward ? 'partial' : 'full';
  deactivator[method](params);
};
