var Marionette = require('backbone.marionette');
var headerTpl = require('./header.tpl');

module.exports = Marionette.ItemView.extend({
  template: headerTpl
});
