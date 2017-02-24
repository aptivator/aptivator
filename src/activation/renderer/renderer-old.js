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
    let cache = cacheAssessor.total(viewConfigs, stateParams);
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
      delete paramsMap[uniqueAddress];
      delete activationRecord.instance;
    });

    instance.render();

    if(relations.isRoot(addressStateName)) {
      return rootViews.push([uniqueAddress, $regionEl]);
    }

    displayer(uniqueAddress, $regionEl);   
  });