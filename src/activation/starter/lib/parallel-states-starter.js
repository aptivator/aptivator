import _         from 'lodash';
import aptivator from '../../../lib/instance';
import relations from '../../../lib/relations';
import vars      from '../../../lib/vars';

let {registry} = vars.states;

export default (stateName, stateParams) => {
  let family = relations.family(stateName);
  let {flags, route, direct} = stateParams;
  let {transient} = flags;
  
  _.each(family, relation => {
    let stateConfigs = registry[relation];
    _.each(stateConfigs.states, parallelStateParams => {
      parallelStateParams = _.cloneDeep(parallelStateParams);
      let {direct: parallelDirect, route: parallelRoute} = parallelStateParams;
      
      if(direct && parallelDirect) {
        parallelStateParams.direct = direct;
      } else {
        delete parallelStateParams.direct;
      }
      
      if(route && parallelRoute) {
        parallelStateParams.route = route;
      } else {
        delete parallelStateParams.route;
      }

      _.extend(parallelStateParams.flags, {transient});
      
      aptivator.activate(parallelStateParams);      
    });
  });
};
