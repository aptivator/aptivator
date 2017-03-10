var Marionette = require('backbone.marionette');
var displayerTpl = require('./displayer.tpl');

module.exports = Marionette.ItemView.extend({
  initialize: function(params) {
    this.params = params;
  },
  
  events: {
    'dependency': 'dependency',
    'processDependency': 'processDependency',
    'click a': 'dependency'
  },
  
  template: displayerTpl,
  
  dependency: function(data) {
    this.$el.find('p').text(data['val1']);
  },
  
  processDependency: function(data) {
    console.log('processDependency', data);
  },
  
  serializeData: function() {
    return this.params;
  }  
});
