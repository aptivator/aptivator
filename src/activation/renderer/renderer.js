import _         from 'lodash';
import aptivator from '../../lib/instance';
import displayer from '../../lib/displayer';
import error     from '../../lib/error';
import params    from '../../lib/params';
import relations from '../../lib/relations';
import vars      from '../../lib/vars';
import canceler  from '../canceler/canceler';
import cacheable from './lib/cacheable';
import viewApi   from './lib/view-api';

let {activationRecords, activationSequences, registry} = vars.states;

export default async stateParams => {
  canceler(stateParams);
  
  stateParams.flags.rendered = true;
  
  activationSequences[stateParams.stateName].forEach(viewConfigs => {
    let {stateName, viewAddressUnique, viewSelector, viewStateName, detachHidden} = viewConfigs;
    let parentViewAddressUnique = registry[viewStateName].viewAddressUnique;
    let parentRecord = activationRecords[parentViewAddressUnique];
    let $parentEl = parentRecord.instance.$el;
    let $regionEl = !viewSelector ? $parentEl : $parentEl.find(viewSelector).eq(0);
    
    if(!$regionEl.length) {
      error.throw(`region [${viewSelector}] does not exist for [${viewStateName}] state`);
    }
    
    let parentRegions = parentRecord.regions || (parentRecord.regions = {});
    let targetRegion = parentRegions[viewSelector] || (parentRegions[viewSelector] = {current: new Set()});
    let activationRecord = activationRecords[viewAddressUnique] || (activationRecords[viewAddressUnique] = {});
    let cache = cacheable.total(viewConfigs, stateParams);
    let destroy = !cache && activationRecord.instance;
    let unhide = !destroy && !_.isEmpty(activationRecord);
    let family = relations.family(stateName).concat(viewAddressUnique);
    let viewParameters = params.assemble(family, stateParams);

    if(destroy) {
      aptivator.destroy({name: viewAddressUnique});
    }
    
    if(unhide) {
      if(!cacheable.implicit.cache) {
        if(!_.isObject(cache) || !cache.receiver) {
          error.throw(`receiver function for variable parameters has not been provided`);
        }
        
        activationRecord.instance[cache.receiver](viewParameters); 
      }
      
      return displayer.display(viewAddressUnique, $regionEl);
    }

    let instance = new viewConfigs.view(viewParameters);
    let serializeData = instance.serializeData;
    
    targetRegion.current.add(viewAddressUnique);
    
    _.extend(activationRecord, {active: true, instance, detached: true, detach: detachHidden});
    
    instance.serializeData = function(...args) {
      var data = serializeData && serializeData.apply(this, args);
      return _.extend(this.options, data, {aptivator: viewApi});
    };
    
    instance.on('destroy', () => {
      aptivator.deactivate({name: viewAddressUnique, forward: true, detach: {children: true}});
      targetRegion.current.delete(viewAddressUnique);
      delete activationRecord.instance;
    });

    displayer.display(viewAddressUnique, $regionEl);   
  });

  return stateParams;
};
