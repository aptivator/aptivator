var Marionette = require('backbone.marionette');
var infoTpl = require('./info.tpl');

module.exports = Marionette.ItemView.extend({
  template: infoTpl,
  className: 'app-2-info'
});
