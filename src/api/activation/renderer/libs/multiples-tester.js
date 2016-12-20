export default (parentConfigs, regionName) => {
  let {multiples} = parentConfigs;
  return (multiples || []).includes(regionName);
};
