import vars from '../lib/vars';

let {history} = vars.states;

export default state => {
  history.push(state);
  history.splice(0, history.length - vars.configs.historySize);
};
