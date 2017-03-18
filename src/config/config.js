import _                     from 'lodash';
import aptivator             from '../lib/aptivator';
import vars                  from '../lib/vars';
import invalidRouteRegistrar from './lib/invalid-route-registrar';

let {configs} = vars;

aptivator.config = settings => {
  if(!settings.templateVars) {
    settings.templateVars = {};
  }
  
  _.extend(configs, settings);
  invalidRouteRegistrar();
};
