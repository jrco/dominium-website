'use strict';

// Register `gameList` component, along with its associated controller and template
angular.
  module('gameList').
  component('gameList', {
    templateUrl: 'game-list/game-list.template.html',
    controller: ['$http',function gameListController($http) {
      var self = this;
      //self.orderProp = 'age';

      $http.get('/games-short').then(function(response) {
        self.games = response.data;
      });
    }]

  // create empty search model (object) to trigger $watch on update
  /*$scope.search = {};

  $scope.resetFilters = function () {
    // needs to be a function or it won't trigger a $watch
    $scope.search = {};
  };

  // pagination controls
  $scope.currentPage = 1;
  $scope.totalItems = $scope.items.length;
  $scope.entryLimit = 8; // items per page
  $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

  // $watch search to update pagination
  $scope.$watch('search', function (newVal, oldVal) {
    $scope.filtered = filterFilter($scope.items, newVal);
    $scope.totalItems = $scope.filtered.length;
    $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    $scope.currentPage = 1;
  }, true);
    */
  });
