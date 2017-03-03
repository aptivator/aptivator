'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _error = require('../../lib/error');

var _error2 = _interopRequireDefault(_error);

var _relations = require('../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _vars = require('../../lib/vars');

var _vars2 = _interopRequireDefault(_vars);

var _receiversGenerator = require('./lib/receivers-generator');

var _receiversGenerator2 = _interopRequireDefault(_receiversGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registry = _vars2.default.states.registry;

exports.default = function (stateParams) {
  var stateName = stateParams.stateName;

  var family = _relations2.default.family(stateName).slice(1);

  _lodash2.default.each(family, function (relation) {
    var _registry$relation = registry[relation],
        stateViews = _registry$relation.views,
        connectingViews = _registry$relation.connectingViews;

    var overriddenMethods = new Set();

    _lodash2.default.each(connectingViews, function (viewConfigs) {
      var storeAses = [];
      var params = {};
      var record = viewConfigs.record,
          deps = viewConfigs.deps;
      var instance = record.instance,
          dependent = record.dependent;
      var receivers = deps.receivers,
          views = deps.views;

      var depReceivers = {};

      if (receivers) {
        params.all = [];
        depReceivers.all = (0, _receiversGenerator2.default)(instance, receivers, params.all);
      }

      _lodash2.default.each(views, function (depConfigs, depHash) {
        var _ref = stateViews[depHash] || {},
            _ref$record = _ref.record,
            record = _ref$record === undefined ? {} : _ref$record;

        var dependency = record.dependency,
            dependencyInstance = record.instance;
        var _dependencyInstance$e = dependencyInstance.events,
            events = _dependencyInstance$e === undefined ? {} : _dependencyInstance$e,
            delegateEvents = dependencyInstance.delegateEvents;


        if (_lodash2.default.isEmpty(record)) {
          _error2.default.throw('dependency [' + depHash + '] view does not exist', 'connector');
        }

        if (dependent && dependency) {
          return;
        }

        var receivers = depConfigs.receivers,
            intercept = depConfigs.intercept;


        if (receivers) {
          params[depHash] = [];
          depReceivers[depHash] = (0, _receiversGenerator2.default)(instance, receivers, params[depHash]);
        }

        _lodash2.default.each(intercept, function (interceptConfigs, intercepted) {
          var storeAs = interceptConfigs.storeAs,
              debounce = interceptConfigs.debounce,
              receivers = interceptConfigs.receivers,
              local = interceptConfigs.local;


          if (!storeAs) {
            _error2.default.throw('[storeAs] property should be defined for every intercepted method', 'connector');
          }

          if (storeAses.includes(storeAs)) {
            _error2.default.throw('[storeAs] property should be unique', 'connector');
          }

          if (!events[intercepted] && !dependencyInstance[intercepted]) {
            _error2.default.throw('event or method [' + intercepted + '] is not included in the [' + depHash + '] dependency', 'connector');
          }

          storeAses.push(storeAs);

          var methodHash = (dependency + '-' + intercepted).replace(/\s+/g, '-');

          if (!overriddenMethods.has(methodHash)) {
            (function () {
              var method = events[intercepted] || intercepted;
              var callback = dependencyInstance[method];
              var triggerer = function triggerer(result) {
                return dependencyInstance.trigger(methodHash, result);
              };
              triggerer = _lodash2.default.debounce(triggerer, debounce || 0);

              dependencyInstance[method] = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                var result = callback.apply(this, args);
                triggerer(result);
                return result;
              };

              if (delegateEvents) {
                dependencyInstance.delegateEvents();
              }

              overriddenMethods.add(methodHash);
            })();
          }

          if (receivers) {
            depReceivers[methodHash] = (0, _receiversGenerator2.default)(instance, receivers, [storeAs]);
          }

          if (!local) {
            if (params.all) {
              params.all.push(storeAs);
            }

            if (params[depHash]) {
              params[depHash].push(storeAs);
            }
          }

          _lodash2.default.each(depReceivers, function (receivers, receiversMethodHash) {
            if (local && receiversMethodHash !== methodHash) {
              return;
            }

            _lodash2.default.each(receivers, function (receiver) {
              receiver = _lodash2.default.partial(receiver, storeAs, _lodash2.default);
              instance.listenTo(dependencyInstance, methodHash, receiver);
            });
          });

          delete depReceivers[methodHash];
        });

        delete depReceivers[depHash];

        _lodash2.default.extend(record, { dependency: true });
      });

      _lodash2.default.extend(record, { dependent: true });
    });
  });

  return stateParams;
};