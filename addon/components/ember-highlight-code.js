import Ember from 'ember';
import layout from '../templates/components/ember-highlight-code';

function str_pad(input, pad_length, pad_string, pad_type) {
  //  discuss at: http://phpjs.org/functions/str_pad/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Michael White (http://getsprink.com)
  //    input by: Marco van Oort
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //   example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
  //   returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
  //   example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
  //   returns 2: '------Kevin van Zonneveld-----'

  var half = '',
    pad_to_go;

  var str_pad_repeater = function (s, len) {
    var collect = '';

    while (collect.length < len) {
      collect += s;
    }
    collect = collect.substr(0, len);

    return collect;
  };

  input += '';
  pad_string = pad_string !== undefined ? pad_string : ' ';

  if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
    pad_type = 'STR_PAD_RIGHT';
  }
  if ((pad_to_go = pad_length - input.length) > 0) {
    if (pad_type === 'STR_PAD_LEFT') {
      input = str_pad_repeater(pad_string, pad_to_go) + input;
    } else if (pad_type === 'STR_PAD_RIGHT') {
      input = input + str_pad_repeater(pad_string, pad_to_go);
    } else if (pad_type === 'STR_PAD_BOTH') {
      half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
      input = half + input + half;
      input = input.substr(0, pad_length);
    }
  }

  return input;
}

export default Ember.Component.extend({
  layout: layout,
  
  tagName: 'pre',
  
  classNames: ["ember-highlight-code"],
  classNameBindings: ["language"],
  
  
  ////////////////
  //! Variables //
  ////////////////
  
  addLineNumbers: false,
  
  ///////////////
  //! Computed //
  ///////////////
  
  formattedCode: Ember.computed({
    get: function(){
      var that = this,
      
        // Fix indentation from the HTML source.
        code = that.$().html(),
        // Get the first line's spaces and replace an initial new line.
        spaces = code.replace(/\n/, '').match(/^\s+/g),
        // Replace the number of first line spaces on all lines following.
        spacesRegExp = new RegExp('^' + spaces, 'gm'),
        formattedCode = code.replace(spacesRegExp, '');
      
      // Remove empty line at end.
      formattedCode = formattedCode.replace(/^\s+|\s+$/g, '');
      
      return formattedCode;
    }
  }),
  
  formattedCodeWithLineNumbers: Ember.computed('formattedCode', {
    get: function(){
      var that = this,
        formattedCode = that.get('formattedCode');
      
      // Split the code into an array.
      var codeArray = formattedCode.split('\n'),
        lastElementNumberLength = String(codeArray.length - 1).length;
      
      // Loop through the array and add line numbers.
      codeArray.forEach(function(line, _i) {
        codeArray[_i] = '<span class="line-number">' + str_pad((_i + 1), lastElementNumberLength, ' ', 'STR_PAD_LEFT') + "</span> " + line;
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
      code = (that.get('addLineNumbers')) ? that.get('formattedCodeWithLineNumbers') : that.get('formattedCode');
    
    // Put formatted code into the element.
    that.$().html(code);
    
    // Highlight the code.
    hljs.highlightBlock(that.$()[0]);
  }
});
