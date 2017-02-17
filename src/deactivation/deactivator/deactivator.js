import deactivator from './lib/deactivator';

export default params => {
  let method = params.partial ? 'partial' : 'full';
  deactivator[method](params);
};
