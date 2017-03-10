var Marionette = require('backbone.marionette');
var displayerTpl = require('./displayer.tpl');

module.exports = Marionette.ItemView.extend({
  initialize: function(params) {
    this.params = params;
  },
  
  events: {
    'dependency': 'dependency'
  },
  
  template: displayerTpl,
  
  dependency: function(data) {
    this.$el.find('p').text(data['val1']);
  },
  
  serializeData: function() {
    return this.params;
  }  
});
