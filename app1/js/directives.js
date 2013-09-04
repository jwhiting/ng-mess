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
  });
