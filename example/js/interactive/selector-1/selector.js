var $ = require('jquery');
var Marionette = require('backbone.marionette');
var selectorTpl = require('./selector.tpl');

module.exports = Marionette.ItemView.extend({
  initialize: function(params) {
    this.params = params;
  },
  
  ui: {
    selector: '.selector',
    form: '#another-form'
  },
  
  events: {
    'change .selector': 'select'
  },
  
  template: selectorTpl,
  
  disableForm: function() {
    this.ui.form.find('select').attr('disabled', 'disabled');
  },
  
  enableForm: function() {
    this.ui.form.find('select').removeAttr('disabled');
  },
  
  resetData: function() {
    this.ui.form[0].reset();
  },
  
  serializeData: function() {
    return this.params;
  },
  
  select: function(evt) {
    var selected = $(evt.target).val();
    return selected;
  }
});
