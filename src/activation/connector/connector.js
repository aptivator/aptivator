import _                  from 'lodash';
import error              from '../../lib/error';
import relations          from '../../lib/relations';
import vars               from '../../lib/vars';
import receiversGenerator from  './lib/receivers-generator';

let {registry} = vars.states;

export default stateParams => {
  let {stateName} = stateParams;
  let family = relations.family(stateName).slice(1);
  
  _.each(family, relation => {
    let {views: stateViews, connectingViews} = registry[relation];
    let overriddenMethods = new Set();
    
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
        let {record = {}} = stateViews[depHash] || {};
        let {dependency, instance: dependencyInstance} = record;
        let {events = {}, delegateEvents} = dependencyInstance;
        
        if(_.isEmpty(record)) {
          error.throw(`dependency [${depHash}] view does not exist`, 'connector');
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
            error.throw(`[storeAs] property should be defined for every intercepted method`, 'connector');
          }
          
          if(storeAses.includes(storeAs)) {
            error.throw('[storeAs] property should be unique', 'connector');
          }
          
          if(!events[intercepted] && !dependencyInstance[intercepted]) {
            error.throw(`event or method [${intercepted}] is not included in the [${depHash}] dependency`, 'connector');
          }
          
          storeAses.push(storeAs);
          
          let methodHash = `${depHash}-${intercepted}`.replace(/\s+/g, '-');
          
          if(dependency) {
            overriddenMethods.add(methodHash);
          }
          
          if(!overriddenMethods.has(methodHash)) {
            let method = events[intercepted] || intercepted;
            let callback = dependencyInstance[method];
            let triggerer = result => dependencyInstance.trigger(methodHash, result);
            triggerer = _.debounce(triggerer, debounce || 0);
            
            dependencyInstance[method] = function(...args) {
              let result = callback.apply(this, args);
              triggerer(result);
              return result;
            };
            
            if(delegateEvents) {
              dependencyInstance.delegateEvents();
            }
            
            overriddenMethods.add(methodHash);
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
              receiver = _.partial(receiver, storeAs, _);
              instance.listenTo(dependencyInstance, methodHash, receiver);
            });
          });
          
          delete depReceivers[methodHash];
        });
        
        delete depReceivers[depHash];
        
        _.extend(record, {dependency: true});
      });
      
      _.extend(record, {dependent: true});
    });
  });
  
  return stateParams;  
};
