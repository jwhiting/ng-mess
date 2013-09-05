'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1').
 
  factory('spinStates',function(){
    var active = {};
    var registry = {};
    var getStartedSpinner = function(element) {
      var spinnerOpts = {
        lines: 9, // The number of lines to draw
        length: 0, // The length of each line
        width: 3, // The line thickness
        radius: 5, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1.5, // Rounds per second
        trail: 33, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
      };
      console.log("element:",element);
      var spinner = new Spinner(spinnerOpts).spin(element[0]);
      angular.element(element).addClass('cleartext');
      return spinner;
    }
    var spinStates = {
      register: function(element, usageId) {
      console.log("register element:",element);
        if (!registry[usageId]) registry[usageId] = {}
        if (!registry[usageId][element]) registry[usageId][element] = 1;
      console.log("register2 element:",element);
        if (active[usageId]) {
          if (registry[usageId][element] == 1) {
      console.log("register3 element:",element);
            registry[usageId][element] = getStartedSpinner(element);
          }
        }
      },
      unregister: function(element, usageId) {
        if (registry[usageId]) {
          if (registry[usageId][element]) {
            if (registry[usageId][element] != 1) {
              registry[usageId][element].stop();
              element.removeClass('cleartext');
            }
            delete registry[usageId][element];
          }
        }
      },
      unregisterAll: function(usageId) {
        if (registry[usageId]) {
          angular.forEach(registry[usageId],function(value,element){
            if (value != 1) {
              value.stop();
              element.removeClass('cleartext');
            }
          });
          delete registry[usageId];
        }
      },
      setActive: function(usageId) {
        active[usageId] = 1;
        if (registry[usageId]) {
          angular.forEach(registry[usageId],function(value,element){
            if (value == 1) {
              registry[usageId][element] = getStartedSpinner(element);
            }
          });
        }
      },
      setInactive: function(usageId) {
        active[usageId] = 0;
        if (registry[usageId]) {
          angular.forEach(registry[usageId],function(value,element){
            if (value != 1) {
              value.stop();
              element.removeClass('cleartext');
              registry[usageId][element] = 1;
            }
          });
        }
      }
    }
    return spinStates;
  })

  ;
