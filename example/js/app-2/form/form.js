var $ = require('jquery');
var aptivator = require('aptivator');
var Marionette = require('backbone.marionette');
var formTpl = require('./form.tpl');

module.exports = Marionette.ItemView.extend({
  initialize: function() {
    setTimeout(function() {
      this.$el.find('input:first').val('test test ....');
    }.bind(this), 5000);
  },
  
  className: 'app-2-form',
  
  template: formTpl,
  
  events: {
    'click button:eq(0)': 'weave',
    'click button:eq(1)': 'deactivate',
    'keyup input:eq(1)': 'inputer'
  },
  
  inputer: function(evt) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve($(evt.target).val());
      });
    });
  },
  
  deactivate: function(evt) {
    evt.preventDefault();
    aptivator.deactivate({name: 'app-2.form.message', partial: true});
  },
  
  weave: function(evt) {
    evt.preventDefault();
    aptivator.activate({name: 'app-2.form.message', flags: {parallel: true, spliced: true, noResolves: true}});
    return 'message';
  }  
});
