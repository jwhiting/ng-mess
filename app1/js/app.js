'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'ngStorage']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/tasks', {templateUrl: 'partials/partial1.html', controller: 'TaskListCtrl'});
    $routeProvider.when('/new', {templateUrl: 'partials/partial2.html', controller: 'NewTaskCtrl'});
    $routeProvider.otherwise({redirectTo: '/tasks'});
  }]);
