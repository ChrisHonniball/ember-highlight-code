import Ember from 'ember';
import layout from '../templates/components/ember-highlight-code';

export default Ember.Component.extend({
  layout: layout,
  
  tagName: 'pre',
  
  classNames: ["ember-highlight-code"],
  classNameBindings: ["language", "addLineNumbers:ember-hightlight-code-w-line-numbers"],
  
  
  ////////////////
  //! Variables //
  ////////////////
  
  addLineNumbers: false,
  startLineNumersAt: 1,
  
  ///////////////
  //! Computed //
  ///////////////
  
  formattedCodeWithLineNumbers: Ember.computed('formattedCode', {
    get: function(){
      var that = this,
        formattedCode = that.$().html();
      
      // Split the code into an array.
      var codeArray = formattedCode.split('\n');
      
      // Loop through the array and add line numbers.
      codeArray.forEach(function(line, _i) {
        codeArray[_i] = '<span class="line-number">' + (_i + that.get('startLineNumersAt')) + "</span> " + line;
      });
      
      // Rejoin the array to be a code block.
      formattedCode = codeArray.join('\n');
      
      return formattedCode;
    }
  }),
  
  
  /////////////
  //! Events //
  /////////////
  
  didInsertElement: function() {
    var that = this,
       
      // Fix indentation from the HTML source.
      code = that.$().html(),
      // Get the first line's spaces and replace an initial new line.
      spaces = code.replace(/\n/, '').match(/^\s+/g),
      // Replace the number of first line spaces on all lines following.
      spacesRegExp = new RegExp('^' + spaces, 'gm'),
      formattedCode = code.replace(spacesRegExp, '').replace(/^\s+|\s+$/g, '');
    
    that.$().html(formattedCode);
    
    that.set('rawCode', formattedCode);
    
    // Highlight the code.
    hljs.highlightBlock(that.$()[0]);
    
    if(that.get('addLineNumbers')) {
      // Put formatted code into the element.
      code = that.get('formattedCodeWithLineNumbers');
      
      that.$().html(code);
    }
  }
});
