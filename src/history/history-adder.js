import {configs, history} from '../lib/vars';

export default state => {
  history.push(state);
  history.splice(0, history.length - configs.historySize);
};
