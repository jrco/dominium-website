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
        otherwise('/games');
    }
  ]);
