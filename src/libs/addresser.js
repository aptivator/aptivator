let addresser = {
  parts: address => address.split('@'),

  region(viewAddress) {
    return this.parts(viewAddress)[0];
  },
  
  stateName(viewAddress) {
    return this.parts(viewAddress)[1];
  }
};

export default addresser;
