var Marionette = require('backbone.marionette');
var aboutTpl = require('./about.tpl');

module.exports = Marionette.ItemView.extend({
  template: aboutTpl,
  className: 'app-2-about'
});
