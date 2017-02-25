import _            from 'lodash';
import animator     from '../../animation/animator';
import aptivator    from '../../lib/instance';
import hookResulter from '../../lib/hook-resulter';
import relations    from '../../lib/relations';
import vars         from '../../lib/vars';
import deactivator  from './lib/deactivator';

let {rootStateName} = vars;
let eventHandle = 'aptivator-goto-finish';

export default stateParams => 
  new Promise(resolve => {
    stateParams.flags.deactivating = false;
    
    let query = {flags: {active: true, deactivating: true}};
    let deactivatingStates = aptivator.history.find(query);

    if(deactivatingStates.length) {
      aptivator.once(eventHandle, resolve);
      return;
    }
  
    let otherActives = aptivator.history.find(stateParams => {
      let {active, deactivating} = stateParams.flags;
      if(active && _.isUndefined(deactivating)) {
        return true;
      }
    });
    
    query = {flags: {active: true, deactivating: false}};
    deactivatingStates = aptivator.history.find(query);
    
    let deactivationRecords = {};
    let deactivationFinalists = [];
    
    _.each(deactivatingStates, stateParams => {
      let {stateName, flags} = stateParams;
      let {partial} = flags;
      let firstAncestorName = relations.parts(stateName)[0];
      let actives = _.filter(otherActives, stateParams => {
        return stateParams.stateName.startsWith(partial ? stateName : firstAncestorName);
      });

      actives.push(stateParams);
      deactivationFinalists.push(...actives);
      _.remove(otherActives, stateParams => actives.includes(stateParams));
      
      let record = deactivationRecords[firstAncestorName];
    
      if(!record) {
        record = {stateNames: [], min: stateName, max: stateName};
        deactivationRecords[firstAncestorName] = record;
      }

      let {min, max, stateNames} = record;

      _.each(actives, stateParams => {
        let {stateName, flags} = stateParams;
        let {partial} = flags;
        
        stateNames.push(stateName);
        
        if(!partial) {
          if(min !== rootStateName) {
            min = rootStateName;
          }
        } else {
          if(min.length > stateName.length) {
            min = stateName;
          }
        }
        
        if(max.length < stateName.length) {
          max = stateName;
        }
      });
      
      stateNames.sort(relations.hierarchySorter());
      _.extend(record, {min, max});
    });
    
    let stateNamePairs = _.reduce(deactivationRecords, (pairs, record) => {
      let {min, stateNames} = record;
      _.each(stateNames, stateName => pairs.push([min, stateName]));
      return pairs;
    }, []);
    
    let animationPromise = animator(stateNamePairs, 'exit').then(() => {
      _.each(deactivationRecords, record => {
        let {min, max, stateNames} = record;
        
        if(min === rootStateName) {
          return deactivator.full({name: max});
        }
        
        _.each(stateNames, stateName => {
          deactivator.partial({name: stateName});
        });
      });
      
      _.each(deactivationFinalists, stateParams => {
        let {stateName} = stateParams;
        aptivator.trigger({handle: `exit:${stateName}`, full: true}, stateParams).then(results => {
          _.extend(stateParams.flags, {active: false, deactivated: true});
          hookResulter(stateParams, 'exit', results);
        });
      });
    });
    
    resolve(animationPromise);
    aptivator.trigger(eventHandle);
  });
