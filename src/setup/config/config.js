import _         from 'lodash';
import aptivator from '../../lib/instance';
import vars      from '../../lib/vars';

aptivator.config = configs => {
  _.extend(vars.configs, configs);
  return aptivator;
};
