export default stateParams => {
  if(stateParams.time) {
    console.log(`%cruntime: ${Date.now() - stateParams.time}ms`, 'color: green;');
  }
};
