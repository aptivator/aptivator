'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _backbone = require('backbone');

var _backbone2 = _interopRequireDefault(_backbone);

var _animator = require('../../../animation/animator');

var _animator2 = _interopRequireDefault(_animator);

var _displayer = require('../../../lib/displayer');

var _displayer2 = _interopRequireDefault(_displayer);

var _paramsAssembler = require('../../../lib/params-assembler');

var _paramsAssembler2 = _interopRequireDefault(_paramsAssembler);

var _relations = require('../../../lib/relations');

var _relations2 = _interopRequireDefault(_relations);

var _deactivator = require('../../../deactivation/deactivator/lib/deactivator');

var _deactivator2 = _interopRequireDefault(_deactivator);

var _rootViewRegistrar = require('./root-view-registrar');

var _rootViewRegistrar2 = _interopRequireDefault(_rootViewRegistrar);

var _viewApi = require('./view-api');

var _viewApi2 = _interopRequireDefault(_viewApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (viewConfigs, stateParams) {
  var view = viewConfigs.view,
      record = viewConfigs.record,
      region = viewConfigs.region,
      uniqueAddress = viewConfigs.uniqueAddress,
      detachHidden = viewConfigs.detachHidden,
      addressStateName = viewConfigs.addressStateName;
  var instance = record.instance,
      ui = record.ui;


  if (instance && ui) {
    instance.destroy();
  }

  var params = (0, _paramsAssembler2.default)(uniqueAddress, stateParams);

  instance = new view(params);
  _lodash2.default.extend(record, { instance: instance, active: true });

  if (!(instance instanceof _backbone2.default.View)) {
    return _lodash2.default.extend(instance, _backbone2.default.Events);
  }

  _lodash2.default.extend(record, { detached: true, detach: detachHidden, ui: true });

  region.current.add(uniqueAddress);
  var _instance = instance,
      destroy = _instance.destroy,
      serializeData = _instance.serializeData;


  instance.serializeData = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var data = serializeData && serializeData.apply(this, args);
    return _lodash2.default.extend(this.options, data, { aptivator: _viewApi2.default });
  };

  instance.destroy = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var animate, animationState;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              animate = params.animate;
              animationState = {
                stateParams: stateParams,
                beginningStateName: uniqueAddress,
                stateName: uniqueAddress,
                primary: true
              };

              if (!animate) {
                _context.next = 5;
                break;
              }

              _context.next = 5;
              return (0, _animator2.default)(animationState, 'exit');

            case 5:

              _deactivator2.default.focal({ name: uniqueAddress, detach: { focal: true, children: true } });
              region.current.delete(uniqueAddress);

              _lodash2.default.extend(record, { active: false });

              if (record.dependency) {
                record.dependency = undefined;
              }

              if (record.dependent) {
                record.dependent = undefined;
              }

              delete record.instance;

              destroy.call(this);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function () {
      return _ref.apply(this, arguments);
    };
  }();

  instance.render();

  if (_relations2.default.isRoot(addressStateName)) {
    return (0, _rootViewRegistrar2.default)(viewConfigs, stateParams);
  }

  (0, _displayer2.default)(viewConfigs);
};