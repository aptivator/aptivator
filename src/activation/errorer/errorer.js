export default (e, stateParams) => {
  console.error(e);
  return Promise.reject(e);
};
