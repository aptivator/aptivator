import _         from 'lodash';
import aptivator from '../../lib/instance';
import displayer from '../../lib/displayer';
import error     from '../../lib/error';
import params    from '../../lib/params';
import relations from '../../lib/relations';
import vars      from '../../lib/vars';
import cacheable from './lib/cacheable';
import viewApi   from './lib/view-api';

let {activationRecords, activationSequences, registry} = vars.states;

export default stateParams => {
  stateParams.flags.rendered = true;
  
  let rootViews = stateParams.rootViews = [];
  let {augment} = stateParams.flags;
  
  activationSequences[stateParams.stateName].forEach(viewConfigs => {
    let {viewAddressUnique, viewSelector, viewStateName, detachHidden} = viewConfigs;
    let activationRecord = activationRecords[viewAddressUnique] || (activationRecords[viewAddressUnique] = {});
    
    if(augment && activationRecord.active) {
      return;
    }
    
    let parentViewAddressUnique = registry[viewStateName].viewAddressUnique;
    let parentRecord = activationRecords[parentViewAddressUnique];
    let $parentEl = parentRecord.instance.$el;
    let $regionEl = !viewSelector ? $parentEl : $parentEl.find(viewSelector).eq(0);
    let parentRegions = parentRecord.regions || (parentRecord.regions = {});
    let targetRegion = parentRegions[viewSelector] || (parentRegions[viewSelector] = {current: new Set()});
    let cache = cacheable.total(viewConfigs, stateParams);
    let destroy = !cache && activationRecord.instance;
    let unhide = !destroy && activationRecord.instance;
    let family = relations.family(viewAddressUnique);
    let viewParameters = params.assemble(family, stateParams);
    
    if(!$regionEl.length) {
      error.throw(`region [${viewSelector}] does not exist for [${viewStateName}] state`);
    }
    
    if(destroy) {
      aptivator.destroy({name: viewAddressUnique});
    }
    
    if(unhide) {
      if(!cacheable.implicit.cache) {
        if(_.isObject(cache) || cache.receiver) {
          activationRecord.instance[cache.receiver](viewParameters); 
        }
      }
      
      if(relations.isRoot(viewStateName)) {
        rootViews.push([viewAddressUnique, $regionEl]);
      }
    
      return displayer(viewAddressUnique, $regionEl);
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
      activationRecord.active = false;
      delete activationRecord.instance;
    });

    instance.render();

    if(relations.isRoot(viewStateName)) {
      return rootViews.push([viewAddressUnique, $regionEl]);
    }

    displayer(viewAddressUnique, $regionEl);   
  });

  return stateParams;
};
