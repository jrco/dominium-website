'use strict';

angular.
  module('Dominium').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/games', {
          template: '<game-list></game-list>'
        }).
        when('/games/:gameId', {
          template: '<game-detail></game-detail>'
        }).
        otherwise({
			redirectTo: function(){
					window.location = '/index';
			}
		});
    }
  ]).controller('ScrollController', ['$scope', '$location', '$anchorScroll',
  function($scope, $location, $anchorScroll) {
    $scope.gotoBottom = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('bottom');

      // call $anchorScroll()
      $anchorScroll();
    };
  }]);;
