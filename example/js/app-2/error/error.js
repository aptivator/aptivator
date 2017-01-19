var Marionette = require('backbone.marionette');
var errorTpl = require('./error.tpl');

module.exports = Marionette.ItemView.extend({
  template: errorTpl
});
