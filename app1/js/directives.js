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
          $http.get(attrs.betterXhrModal).then(function(result){
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
          }, function(error){
            console.log("better xhr modal failed to get modal content", error);
            //... eventually i want the modal directive to implement error handling with a specific error modal
          });
        }
        element.bind('click',loadModal);
      }
    }
  }])

;
