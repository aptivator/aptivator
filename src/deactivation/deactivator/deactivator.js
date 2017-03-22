import _            from 'lodash';
import animator     from '../../animation/animator';
import aptivator    from '../../lib/aptivator';
import hookResulter from '../../lib/hook-resulter';
import relations    from '../../lib/relations';
import deactivator  from './lib/deactivator';

import {deactivating, rootStateName} from '../../lib/vars';

let eventHandle = 'aptivator-goto-finish';

export default stateParams => 
  new Promise(resolve => {
    if(!stateParams) {
      return resolve();
    }
    
    stateParams.flags.deactivating = false;
    
    let query = {flags: {active: true, deactivating: true}};
    let deactivatingStates = aptivator.history.find(query);

    if(deactivatingStates.length) {
      aptivator.once(eventHandle, resolve);
      return;
    }
  
    let otherActives = aptivator.history.find(stateParams => {
      let {active, deactivating} = stateParams.flags;
      return active && _.isUndefined(deactivating);
    });
    
    query = {flags: {active: true, deactivating: false}};
    deactivatingStates = aptivator.history.find(query);

    let ancestorGroupings = {};
    let triggerables = [];
    
    _.each(deactivatingStates, stateParams => {
      let {stateName, flags} = stateParams;
      let {partial} = flags;
      let ancestor = relations.parts(stateName)[0];
      let comparator = partial ? stateName : ancestor;
      let operator = partial ? 'gt' : 'gte';
      let actives = _.filter(otherActives, stateParams => {
        let {stateName} = stateParams;
        if(stateName.startsWith(comparator)) {
          return _[operator](stateName.length, comparator.length);
        }
      });

      actives.push(stateParams);
      triggerables.push(...actives);
      _.remove(otherActives, stateParams => actives.includes(stateParams));
      
      let grouping = ancestorGroupings[ancestor];
    
      if(!grouping) {
        grouping = {stateNames: [], min: stateName, max: stateName, stateParams};
        ancestorGroupings[ancestor] = grouping;
      }

      let {min, max, stateNames} = grouping;

      _.each(actives, stateParams => {
        let {stateName, flags} = stateParams;
        let {partial} = flags;
        
        stateNames.push(stateName);
        
        if(!relations.isRoot(min)) {
          if(!partial) {
            min = rootStateName;
          } else if(min.length > stateName.length) {
            min = stateName;
          }
        }
        
        if(max.length < stateName.length) {
          max = stateName;
        }
      });
      
      stateNames.sort(relations.hierarchySorter());
      _.extend(grouping, {min, max});
    });
    
    let animationStates = _.reduce(ancestorGroupings, (animationStates, grouping) => {
      let {min, max, stateParams: deactivatingStateParams} = grouping;
      let primary = stateParams === deactivatingStateParams;
      animationStates.push({
        beginningStateName: min, 
        stateName: max, 
        stateParams: deactivatingStateParams, 
        primary});
      return animationStates;
    }, []);
    
    let animationPromise = animator(animationStates, 'exit').then(() => {
      _.each(ancestorGroupings, grouping => {
        let {min, max, stateNames} = grouping;
        
        if(relations.isRoot(min)) {
          return deactivator.full({name: max});
        }
        
        _.each(stateNames, stateName => {
          deactivator.partial({name: stateName});
        });
      });
      
      _.each(triggerables, stateParams => {
        _.extend(stateParams.flags, {active: false, deactivated: true});
        let triggerObj = {handle: `exit:${stateParams.stateName}`, full: true, args: [stateParams]};
        aptivator.trigger(triggerObj).then(results => hookResulter('exit', stateParams, results));
      });
    });
    
    resolve(animationPromise);
    aptivator.trigger(eventHandle);
    _.remove(deactivating, () => true);
  });
