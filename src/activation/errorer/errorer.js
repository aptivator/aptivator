export default (e, stateParams) => {
  console.error(stateParams.stateName, e);
  return Promise.reject(e);
};
