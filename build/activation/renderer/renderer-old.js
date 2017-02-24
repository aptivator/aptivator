'use strict';

activationSequences[stateParams.stateName].forEach(function (viewConfigs) {
  var uniqueAddress = viewConfigs.uniqueAddress,
      addressSelector = viewConfigs.addressSelector,
      addressStateName = viewConfigs.addressStateName,
      detachHidden = viewConfigs.detachHidden;

  var activationRecord = activationRecords[uniqueAddress] || (activationRecords[uniqueAddress] = {});

  if (augment && activationRecord.active) {
    return;
  }

  var parentUniqueAddress = registry[addressStateName].uniqueAddress;
  var parentRecord = activationRecords[parentUniqueAddress];
  var $parentEl = parentRecord.instance.$el;
  var $regionEl = !addressSelector ? $parentEl : $parentEl.find(addressSelector).eq(0);
  var parentRegions = parentRecord.regions || (parentRecord.regions = {});
  var targetRegion = parentRegions[addressSelector] || (parentRegions[addressSelector] = { current: new Set() });
  var cache = cacheAssessor.total(viewConfigs, stateParams);
  var instance = activationRecord.instance;

  var destroy = !cache && instance;
  var unhide = !destroy && instance;
  var family = relations.family(uniqueAddress);
  var viewParameters = params.assemble(family, stateParams);

  if (!$regionEl.length) {
    error.throw('region [' + addressSelector + '] does not exist for [' + addressStateName + '] state');
  }

  if (destroy) {
    instance.destroy();
  }

  if (unhide) {
    if (!cacheable.implicit.cache) {
      if (_.isObject(cache) || cache.receiver) {
        instance[cache.receiver](viewParameters);
      }
    }

    if (relations.isRoot(addressStateName)) {
      rootViews.push([uniqueAddress, $regionEl]);
    }

    return displayer(uniqueAddress, $regionEl);
  }

  instance = new viewConfigs.view(viewParameters);
  var serializeData = instance.serializeData;

  targetRegion.current.add(uniqueAddress);

  _.extend(activationRecord, { active: true, instance: instance, detached: true, detach: detachHidden });

  instance.serializeData = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var data = serializeData && serializeData.apply(this, args);
    return _.extend(this.options, data, { aptivator: viewApi });
  };

  instance.on('destroy', function () {
    deactivator.partial({ name: uniqueAddress, detach: { children: true } });
    targetRegion.current.delete(uniqueAddress);
    delete paramsMap[uniqueAddress];
    delete activationRecord.instance;
  });

  instance.render();

  if (relations.isRoot(addressStateName)) {
    return rootViews.push([uniqueAddress, $regionEl]);
  }

  displayer(uniqueAddress, $regionEl);
});