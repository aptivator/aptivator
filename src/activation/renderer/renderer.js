import _           from 'lodash';
import aptivator   from '../../lib/instance';
import displayer   from '../../lib/displayer';
import error       from '../../lib/error';
import params      from '../../lib/params';
import relations   from '../../lib/relations';
import vars        from '../../lib/vars';
import deactivator from '../../deactivation/deactivator/lib/deactivator';
import canceler    from '../canceler/canceler';
import cacheable   from './lib/cacheable';
import viewApi     from './lib/view-api';

let {activationRecords, activationSequences, registry} = vars.states;

export default stateParams => {
  canceler(stateParams);
  
  stateParams.flags.rendered = true;
  
  let rootViews = stateParams.rootViews = [];
  let {augment} = stateParams.flags;
  
  activationSequences[stateParams.stateName].forEach(viewConfigs => {
    let {uniqueAddress, addressSelector, addressStateName, detachHidden} = viewConfigs;
    let activationRecord = activationRecords[uniqueAddress] || (activationRecords[uniqueAddress] = {});
    
    if(augment && activationRecord.active) {
      return;
    }
    
    let parentUniqueAddress = registry[addressStateName].uniqueAddress;
    let parentRecord = activationRecords[parentUniqueAddress];
    let $parentEl = parentRecord.instance.$el;
    let $regionEl = !addressSelector ? $parentEl : $parentEl.find(addressSelector).eq(0);
    let parentRegions = parentRecord.regions || (parentRecord.regions = {});
    let targetRegion = parentRegions[addressSelector] || (parentRegions[addressSelector] = {current: new Set()});
    let cache = cacheable.total(viewConfigs, stateParams);
    let {instance} = activationRecord;
    let destroy = !cache && instance;
    let unhide = !destroy && instance;
    let family = relations.family(uniqueAddress);
    let viewParameters = params.assemble(family, stateParams);
    
    if(!$regionEl.length) {
      error.throw(`region [${addressSelector}] does not exist for [${addressStateName}] state`);
    }
    
    if(destroy) {
      instance.destroy();
    }
    
    if(unhide) {
      if(!cacheable.implicit.cache) {
        if(_.isObject(cache) || cache.receiver) {
          instance[cache.receiver](viewParameters); 
        }
      }
      
      if(relations.isRoot(addressStateName)) {
        rootViews.push([uniqueAddress, $regionEl]);
      }
    
      return displayer(uniqueAddress, $regionEl);
    }

    instance = new viewConfigs.view(viewParameters);
    let serializeData = instance.serializeData;
    
    targetRegion.current.add(uniqueAddress);
    
    _.extend(activationRecord, {active: true, instance, detached: true, detach: detachHidden});
    
    instance.serializeData = function(...args) {
      var data = serializeData && serializeData.apply(this, args);
      return _.extend(this.options, data, {aptivator: viewApi});
    };
    
    instance.on('destroy', () => {
      deactivator.partial({name: uniqueAddress, detach: {children: true}});
      targetRegion.current.delete(uniqueAddress);
      delete activationRecord.instance;
    });

    instance.render();

    if(relations.isRoot(addressStateName)) {
      return rootViews.push([uniqueAddress, $regionEl]);
    }

    displayer(uniqueAddress, $regionEl);   
  });

  return stateParams;
};
