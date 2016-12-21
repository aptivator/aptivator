export default {
  message: error => `aptivator: ${error}`,
  
  'throw'(error) {
    throw new Error(this.message(error));
  }
};
