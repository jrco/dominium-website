'use strict';

// Register `gameDetail` component, along with its associated controller and template
angular.
  module('gameDetail').
  component('gameDetail', {
    templateUrl: 'game-detail/game-detail.template.html',
    controller: ['$http', '$routeParams',
      function GameDetailController($http, $routeParams) {
        var self = this;

        $http.get('games/' + $routeParams.gameId).then(function(response) {
        	self.game = response.data;
        });
        //this.gameId = $routeParams.gameId;
      }
    ]
  });