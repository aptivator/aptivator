var Marionette = require('backbone.marionette');
var mainTpl = require('./main.tpl');

module.exports = Marionette.ItemView.extend({
  el: '#application',
  template: mainTpl
});
