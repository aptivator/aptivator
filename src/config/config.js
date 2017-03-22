import _                     from 'lodash';
import aptivator             from '../lib/aptivator';
import invalidRouteRegistrar from './lib/invalid-route-registrar';

import {configs} from '../lib/vars';

aptivator.config = settings => {
  if(!settings.templateVars) {
    settings.templateVars = {};
  }
  
  _.extend(configs, settings);
  invalidRouteRegistrar();
};
