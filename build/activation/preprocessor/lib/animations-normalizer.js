'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (stateConfigs) {
  var _stateConfigs$animate = stateConfigs.animate,
      animate = _stateConfigs$animate === undefined ? {} : _stateConfigs$animate,
      viewsRegistry = stateConfigs.viewsRegistry;

  var processedMap = {};
  var selfClasses = _lodash2.default.reduce(animate, function (selfClasses, typeSettings, animationType) {
    if (_lodash2.default.isString(typeSettings)) {
      animate[animationType] = typeSettings = { self: { self: typeSettings } };
    }
    var specificSelfClasses = _lodash2.default.get(typeSettings, 'self.self', '');
    selfClasses[animationType] = specificSelfClasses.trim();
    return selfClasses;
  }, {});

  var processSpecificSettings = function processSpecificSettings(viewHash, specificSettings, animationType, typeSettings) {
    if (_lodash2.default.isObject(specificSettings)) {
      var _specificSettings = specificSettings,
          augment = _specificSettings.augment,
          classes = _specificSettings.classes;


      if (augment) {
        classes = classes.trim() + ' ' + (selfClasses[animationType] || '');
      }

      specificSettings = classes;
    }

    typeSettings[viewHash] = specificSettings;
  };

  _lodash2.default.each(viewsRegistry, function (viewConfigs) {
    var viewAnimate = viewConfigs.animate,
        viewHash = viewConfigs.viewHash;


    _lodash2.default.each(viewAnimate, function (specificSettings, animationType) {
      var typePath = [animationType, 'self'];
      var typeSettings = _lodash2.default.get(animate, typePath);
      var processed = _lodash2.default.get(processedMap, [animationType]);

      if (!processed) {
        _lodash2.default.set(processedMap, [animationType], processed = ['self']);
      }

      if (!typeSettings) {
        _lodash2.default.set(animate, typePath, typeSettings = {});
      }

      processSpecificSettings(viewHash, specificSettings, animationType, typeSettings);

      processed.push(viewHash);
    });
  });

  _lodash2.default.each(animate, function (typeSettings, animationType) {
    _lodash2.default.each(typeSettings.self, function (specificSettings, viewHash) {
      if ((processedMap[animationType] || []).includes(viewHash)) {
        return;
      }

      processSpecificSettings(viewHash, specificSettings, animationType, typeSettings.self);
    });
  });

  _lodash2.default.extend(stateConfigs, { animate: animate });
};