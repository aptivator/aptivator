export default {
  message(errorMessage, moduleName) {
    return `aptivator: ${moduleName && moduleName + ': ' || ''}${errorMessage}`;
  },
  
  throw(error, moduleName) {
    throw new Error(this.message(error, moduleName));
  },
  
  warn(error, moduleName) {
    return console.warn(this.message(error, moduleName));
  },
  
  errorer: e => console.error(e)
};
