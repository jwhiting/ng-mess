'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }]);

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


