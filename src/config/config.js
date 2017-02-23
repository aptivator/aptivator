import _                     from 'lodash';
import aptivator             from '../lib/instance';
import vars                  from '../lib/vars';
import invalidRouteRegistrar from './lib/invalid-route-registrar';

aptivator.config = configs => {
  _.extend(vars.configs, configs);
  invalidRouteRegistrar();
  return aptivator;
};
