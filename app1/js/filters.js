'use strict';

/* Filters */

angular.module('myApp.filters', []).

  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).

  filter('titlecaps', function(){
    return function(input){
      var el = $('<div></div>');
      for (var i=0; i < input.length; i++) {
        var ch = input.charAt(i);
        if (ch.toUpperCase() == ch) {
          el.append($('<span style="font-size: 150%"></span>').text(ch));
        } else {
          el.append($('<span></span>').text(ch.toUpperCase()));
        }
      }
      return el.html();
    };
  })
;
