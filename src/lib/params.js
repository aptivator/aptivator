import _              from 'lodash';
import addresser      from './addresser';
import relations      from './relations';
import routeAssembler from './route/route-assembler';
import vars           from './vars';

let {dataParams, resolveParams} = vars;

export default {
  assemble(entityName, stateParams) {
    let {direct, route, stateName, hooks} = stateParams;
    let params = {data: {}, resolves: {}, route: {}, direct: {}, hooks: {}};
    let {data, resolves} = params;
    let family = relations.family(entityName);
    let targetEntityName = _.nth(family, -1);
    let targetStateName = addresser.stateName(targetEntityName);
    let targetStateConfigs = vars.states.registry[targetStateName];
    let {error, route: routeConfigs} = targetStateConfigs;
    
    if(route && !_.isEmpty(routeConfigs)) {
      let {parts} = routeConfigs;
      let names = _.reduce(parts, (names, part) => {
        let {name, required} = part;
        
        if(!_.isUndefined(required)) {
          names.push(name);
        }
        return names;
      }, []);
      
      let values = _.values(_.pick(route.params, names));
      
      if(values.length) {
        _.extend(params, {route: routeAssembler(targetStateName, values)});
      }
    }
    
    if(error) {
      _.extend(params, {route});
    }
    
    family.forEach(relation => {
      _.extend(data, dataParams[relation]);
      _.extend(resolves, resolveParams[relation]);
    });

    _.each(hooks, (hookValues, hookName) => {
      let values = [['v'], [targetStateName, 'v']].reduce((values, path) => {
        return _.extend(values, _.get(hookValues, path, {}));
      }, {});
      
      if(!_.isEmpty(values)) {
        params.hooks[hookName] = values;
      }
    });

    if(family.includes(stateName)) {
      if(direct) {
        _.extend(params, {direct});
        _.extend(stateParams, {direct});
      }
      
      _.extend(stateParams, {data, resolves});
    }
    
    return _.cloneDeep(params);
  }
};
