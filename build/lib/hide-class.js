'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var cssRules = '{display: none !important;}';
  var hideClassName = 'hidden-by-aptivator-' + (Math.random() + '').slice(2);
  var $style = (0, _jquery2.default)('<style/>').attr('type', 'text/css').html('.' + hideClassName + ' ' + cssRules);
  (0, _jquery2.default)('head').append($style);
  return hideClassName;
}();