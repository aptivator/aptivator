var Marionette = require('backbone.marionette');
var headerTpl = require('./header.tpl');

module.exports = Marionette.ItemView.extend({
  initialize: function(params) {
    this.params = params;
  },
  
  template: headerTpl,
  
  serializeData: function() {
    return this.options;
  }  
});
