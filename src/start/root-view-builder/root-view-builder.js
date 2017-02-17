import vars from '../../lib/vars';

let {rootStateName, states} = vars;
let {registry, activationRecords} = states;

export default () => {
  let stateConfigs = registry[rootStateName];
  let {view, viewAddressUnique} = registry[rootStateName];
  let instance = new view();

  instance.render();
  activationRecords[viewAddressUnique] = {instance, active: true};
  stateConfigs.viewsRegistry = {[viewAddressUnique]: {view}};
};
