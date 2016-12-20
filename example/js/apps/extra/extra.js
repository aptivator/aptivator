var Marionette = require('backbone.marionette');
var extraTpl = require('./extra.tpl');

module.exports = Marionette.ItemView.extend({
  template: extraTpl
});
