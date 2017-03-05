import _            from 'lodash';
import approximator from './approximator';
import aptivator    from './aptivator';

export default {
  message(errorMessage, moduleName) {
    return `aptivator: ${moduleName && moduleName + ': ' || ''}${errorMessage}`;
  },
  
  throw(error, moduleName) {
    throw new Error(this.message(error, moduleName));
  },
  
  warn(error, moduleName) {
    console.warn(this.message(error, moduleName));
  },
  
  errorer: e => console.error(e)
};
