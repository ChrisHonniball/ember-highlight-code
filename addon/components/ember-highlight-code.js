import Ember from 'ember';
import layout from '../templates/components/ember-highlight-code';

export default Ember.Component.extend({
  layout: layout,
  
  tagName: 'pre',
  
  didInsertElement: function() {
    var that = this,
      code = that.$()[0];
    
    hljs.highlightBlock(code);
  }
});
