export default {
  message: (error, moduleName) => `aptivator: ${moduleName && moduleName + ':' || ''} ${error}`,
  
  'throw'(error, moduleName) {
    throw new Error(this.message(error, moduleName));
  }
};
