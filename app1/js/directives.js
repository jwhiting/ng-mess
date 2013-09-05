'use strict';

/* Directives */


angular.module('myApp.directives', []).

  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).

  directive('derpyXhrModal', function($compile,$timeout) {
    return {
      link: function(scope, element, attrs) {
        scope.inModal = false;
        scope.activeModal = false;
        scope.openIt = function() {
          console.log("derpy xhr open modal stage 1");
          scope.activeModal = false;
          scope.inModal = true;
          scope.$apply();
          $timeout(function(){
            console.log("derpy xhr open modal stage 2");
            scope.activeModal = true;
          });
        };
        scope.closeIt = function() {
          console.log("derpy xhr close modal stage 1");
          scope.activeModal = false;
          $timeout(function(){
            console.log("derpy  xhr close modal stage 2");
            scope.inModal = false;
          }, 200);
        };
        scope.didLoad = function() {
          console.log("derpy xhr content loaded");
        }
        var derp = $compile('<div ng-class="{showing: inModal, hidden: !inModal, on: activeModal, off: !activeModal}" class="fade off modal-outer"><div class="modal-inner-1"><div class="modal-inner-2"><div class="modal-inner-3"><div class="modal-bg" ng-click="closeIt()"></div><div ng-class="{showing: inModal, hidden: !inModal, on: activeModal, off: !activeModal}" class="modal-content zoom off"><div ng-include="\''+attrs.derpyXhrModal+'\'" onload="didLoad()"></div></div></div></div></div></div>')(scope);
        element.after(derp);
        element.bind('click',scope.openIt);
      }
    };
  }).

  directive('fancyfoo', function(){
    return {
      transclude: true,
      templateUrl: 'partials/fancyfoo.html',
    }
  }).


  directive('modalLayout', function(){
    return {
      transclude: true,
      templateUrl: 'partials/modal-layout.html',
    }
  }).

  directive('betterXhrModal', ['$compile','$timeout','$document','$http',function($compile,$timeout,$document,$http){
    return {
      link: function(scope, element, attrs) {
        function loadModal() {
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
          var spinner = new Spinner(spinnerOpts).spin(element[0]);
          element.addClass('cleartext');
          var fetchPromise = $http.get(attrs.betterXhrModal);
          fetchPromise.then(function(result){
            console.log("better xhr modal got remote modal content",result);
            var content = result.data;
            var modalScope = scope.$new();
            var modalDomEl = $compile(angular.element('<div modal-layout></div>').html(content))(modalScope);
            modalScope.inModal = false;
            modalScope.activeModal = false;
            modalScope.openIt = function() {
              console.log("better xhr open modal stage 1");
              modalScope.activeModal = false;
              modalScope.inModal = true;
              //modalScope.$apply();
              $timeout(function(){
                console.log("better xhr open modal stage 2");
                modalScope.activeModal = true;
              });
            };
            modalScope.closeIt = function() {
              console.log("better xhr close modal stage 1");
              modalScope.activeModal = false;
              $timeout(function(){
                console.log("better xhr close modal stage 2");
                modalScope.inModal = false;
                modalScope.$destroy();
                modalDomEl.remove();
              }, 200);
            };
            var body = $document.find('body').eq(0); // todo: use root app element instead?
            body.append(modalDomEl);
            modalScope.openIt();
            spinner.stop();
            element.removeClass('cleartext');
          }, function(error){
            spinner.stop();
            element.removeClass('cleartext');
            console.log("better xhr modal failed to get modal content", error);
            //... eventually i want the modal directive to implement error handling with a specific error modal
          })
        }
        element.bind('click',loadModal);
      }
    }
  }]).

  directive('inlineModal', ['$compile','$timeout','$document',function($compile,$timeout,$document,$http){
    return {
      link: function(scope, element, attrs) {
        function loadModal() {
          var inlineEl = angular.element(document.getElementById(attrs.inlineModal));
          if (!inlineEl) {
            throw new Error("couldn't locate the inline element div ("+attrs.inlineModal+")");
            return;
          }
          var modalScope = scope.$new();
          var modalDomEl = $compile(angular.element('<div modal-layout></div>').html(inlineEl.html()))(modalScope);
          modalScope.inModal = false;
          modalScope.activeModal = false;
          modalScope.openIt = function() {
            console.log("inline open modal stage 1");
            modalScope.activeModal = false;
            modalScope.inModal = true;
            //modalScope.$apply();
            $timeout(function(){
              console.log("inline modal stage 2");
              modalScope.activeModal = true;
            });
          };
          modalScope.closeIt = function() {
            console.log("inline close modal stage 1");
            modalScope.activeModal = false;
            $timeout(function(){
              console.log("inline close modal stage 2");
              modalScope.inModal = false;
              modalScope.$destroy();
              modalDomEl.remove();
            }, 200);
          };
          var body = $document.find('body').eq(0); // todo: use root app element instead?
          body.append(modalDomEl);
          modalScope.openIt();
        }
        element.bind('click',loadModal);
      }
    }
  }]).

  directive('titleCaps', function(){
    return {
      scope: {
        text: "@titleCaps", // need this in order to evaluate titleCaps as an ng template text that can contain expressions
      },
      link: function(scope, element, attrs){
        scope.$watch('text',function(){
          var el = angular.element('<div></div>');
          for (var i=0; i < scope.text.length; i++) {
            var ch = scope.text.charAt(i);
            if (ch.toUpperCase() == ch) {
              el.append($('<span style="font-size: 150%"></span>').text(ch));
            } else {
              el.append($('<span></span>').text(ch.toUpperCase()));
            }
          }
          element.empty();
          element.append(el);
        });
      }
    };
  })

;
