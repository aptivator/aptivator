import vars        from '../lib/vars';
import statesCache from './lib/states-cache';

export default state => {
  statesCache.push(state);
  statesCache.splice(0, statesCache.length - vars.configs.historySize);
};
