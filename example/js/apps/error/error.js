var Marionette = require('backbone.marionette');
var errorTpl = require('./error.tpl');

module.exports = Marionette.ItemView.extend({
  initialize: function(params) {
    this.params = params;
  },
  
  template: errorTpl,
  
  serializeData: function() {
    return this.params;
  }  
});
