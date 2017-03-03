import _                    from 'lodash';
import aptivator            from '../../../lib/aptivator';
import relations            from '../../../lib/relations';
import vars                 from '../../../lib/vars';
import transientInitializer from '../../initializer/lib/transient-initializer';

let {registry} = vars.states;

export default stateParams => {
  let {flags, route, direct, stateName, parallels} = stateParams;
  let family = relations.family(stateName);
  let {transient, noResolves, spliced} = flags;
  
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
      
      if(!parallels) {
        parallels = stateParams.parallels = [];
      }
      
      _.extend(parallelStateParams.flags, {transient, noResolves, spliced});
      
      if(transient) {
        parallelStateParams = transientInitializer(parallelStateParams, true);
      } else {
        aptivator.activate(parallelStateParams).catch(_.noop); 
      }
      
      parallels.push(parallelStateParams);
    });
  });
};
