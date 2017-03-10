import _                  from 'lodash';
import error              from '../../lib/error';
import relations          from '../../lib/relations';
import vars               from '../../lib/vars';
import receiversGenerator from  './lib/receivers-generator';

let {registry} = vars.states;
let moduleName = 'connector';

export default stateParams => {
  let {stateName} = stateParams;
  let family = relations.family(stateName).slice(1);
  
  _.each(family, relation => {
    let {views: stateViews, connectingViews} = registry[relation];
    let dependencyRecords = [];
    
    _.each(connectingViews, viewConfigs => {
      let storeAses = [];
      let params = {};
      let {record, deps} = viewConfigs;
      let {instance, dependent} = record;
      let {receivers, views} = deps;
      let depReceivers = {};
      
      if(receivers) {
        params.all = [];
        depReceivers.all = receiversGenerator(instance, receivers, params.all);
      }
      
      _.each(views, (depConfigs, depHash) => {
        let {record = {}} = _.filter(stateViews, {viewHash: depHash})[0] || {};
        let {dependency, instance: dependencyInstance} = record;
        let {events = {}, delegateEvents} = dependencyInstance;
        
        if(_.isEmpty(record)) {
          error.throw(`dependency [${depHash}] view does not exist`, moduleName);
        }
        
        if(dependent && dependency) {
          return;
        }
        
        let {receivers, intercept} = depConfigs;
        
        if(receivers) {
          params[depHash] = [];
          depReceivers[depHash] = receiversGenerator(instance, receivers, params[depHash]);
        }
        
        _.each(intercept, (interceptConfigs, intercepted) => {
          let {storeAs, debounce, receivers, local} = interceptConfigs;
          
          if(!storeAs) {
            error.throw(`[storeAs] property should be defined for every intercepted method`, moduleName);
          }
          
          if(storeAses.includes(storeAs)) {
            error.throw('[storeAs] property should be unique', 'connector');
          }
          
          if(!events[intercepted] && !dependencyInstance[intercepted]) {
            error.throw(`event or method [${intercepted}] is not included in the [${depHash}] dependency`, moduleName);
          }
          
          storeAses.push(storeAs);
          
          let methodHash = `${depHash}-${intercepted}`.replace(/\s+/g, '-');
          let method = events[intercepted] || intercepted;
          let callback = dependencyInstance[method];
          
          if(!callback.overriddenByAptivator) {
            let triggerer = result => dependencyInstance.trigger(methodHash, result);
            triggerer = _.debounce(triggerer, debounce || 0);
            
            dependencyInstance[method] = function(...args) {
              let result = callback.apply(this, args);
              triggerer(result);
              return result;
            };
            
            dependencyInstance[method].overriddenByAptivator = true;
            
            if(delegateEvents) {
              dependencyInstance.delegateEvents();
            }
          }
          
          if(receivers) {
            depReceivers[methodHash] = receiversGenerator(instance, receivers, [storeAs]);
          }
          
          if(!local) {
            if(params.all) {
              params.all.push(storeAs);
            }
            
            if(params[depHash]) {
              params[depHash].push(storeAs);
            }
          }
          
          _.each(depReceivers, (receivers, receiversMethodHash) => {
            if(local && receiversMethodHash !== methodHash) {
              return;
            }
            
            _.each(receivers, receiver => {
              receiver = _.partial(receiver, _, storeAs);
              instance.listenTo(dependencyInstance, methodHash, receiver);
            });
          });
          
          delete depReceivers[methodHash];
        });
        
        delete depReceivers[depHash];
        dependencyRecords.push(record);
      });
      
      _.extend(record, {dependent: true});
    });
    
    _.each(dependencyRecords, record => _.extend(record, {dependency: true}));
  });
  
  return stateParams;  
};
