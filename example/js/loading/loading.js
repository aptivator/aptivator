var Marionette = require('backbone.marionette');
var loadingTpl = require('./loading.tpl');

module.exports = Marionette.ItemView.extend({
  template: loadingTpl
});
