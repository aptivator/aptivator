export default (e, reject) => {
  console.log(e instanceof Error);
  console.error(e);
  reject(e);
};
