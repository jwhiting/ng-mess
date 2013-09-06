'use strict';

/* Controllers */

/*
angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }]);
*/

angular.module('myApp.controllers', []);

function NewTaskCtrl($scope, $localStorage) {
  //todo
};

function TaskListCtrl($scope, $localStorage) {
  $scope.$storage = $localStorage.$default({ foo: 42 });
  $scope.tasks = [
    { "name": "do stuff 1", "owner": "joe" },
    { "name": "do stuff 2", "owner": "bob" },
    { "name": "do stuff 3", "owner": "alice" },
    { "name": "do stuff 4", "owner": "marney" },
  ];
  $scope.sortOrder = 1;
  $scope.sortBy = 'name';

  $scope.doSort = function() {
    var self = this;
    self.tasks.sort(function(a,b){
      if (a[self.sortBy] > b[self.sortBy]) return self.sortOrder;
      if (a[self.sortBy] < b[self.sortBy]) return (-1 * self.sortOrder);
      return 0;
    });
    var props = ['name','owner'];
    self.sortButtonValue = {};
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      if (self.sortBy == prop) {
        self.sortButtonValue[prop] = (self.sortOrder > 0 ? "&darr;&darr;" : "&uarr;&uarr;");
      } else {
        self.sortButtonValue[prop] = "&darr;";
      }
    }
  }
  $scope.sortByProp = function(prop) {
    if ($scope.sortBy == prop) {
      $scope.sortOrder = -1 * $scope.sortOrder;
    } else {
      $scope.sortBy = prop;
    }
    $scope.doSort();
  }

  $scope.doSort();

};


function ModalTestCtrl($scope, $timeout) {

  $scope.openIt = function() {
    console.log("open modal stage 1 (inModal = true)");
    var self=this;
    self.activeModal = false;
    self.inModal = true;
    $timeout(function(){
      console.log("open modal stage 2 (activeModal = true)");
      self.activeModal = true;
    });
  };

  $scope.closeIt = function() {
    console.log("close modal stage 1 (activeModal = false)");
    var self=this;
    self.activeModal = false;
    $timeout(function(){
      console.log("close modal stage 2 (inModal = false)");
      self.inModal = false;
    }, 200);
  };


};

function CardListCtrl($scope,$http) {
  $scope.cards = [];
  $http.get('json/cards.json').then(function(result){
    $scope.cards = result.data;
  });
}

angular.module('myApp.controllers', []).
  controller('CardCtrl', ['$scope','$timeout', function ($scope,$timeout) {
    //$scope.card.flipped = false;
    //$scope.$watch('card.renderedDescription',function(){
    //  $scope.card.frontDescriptionHtml = $scope.card.renderedDescription;
    //  $timeout(function(){

    //  });
    //});
  }]);

