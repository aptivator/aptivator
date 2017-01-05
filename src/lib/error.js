export default {
  message: (error, moduleName) => new Error(`aptivator: ${moduleName && moduleName + ': ' || ''}${error}`),
  
  'throw'(error, moduleName) {
    throw this.message(error, moduleName);
  },
  
  console: e => console.error(e)
};
