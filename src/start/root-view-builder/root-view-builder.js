import vars from '../../lib/vars';

let {rootStateName, states} = vars;
let {registry, activationRecords} = states;

export default () => {
  let {view, uniqueAddress} = registry[rootStateName];
  let instance = new view();

  instance.render();
  activationRecords[uniqueAddress] = {instance, active: true};
};
