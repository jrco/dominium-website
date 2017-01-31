'use strict';

// Register `gameDetail` component, along with its associated controller and template
angular.
module('gameDetail').
component('gameDetail', {
    templateUrl: 'game-detail/game-detail.template.html',
    controller: ['$http', '$routeParams',
        function GameDetailController($http, $routeParams) {
            var self = this;

			initMap();

            $http.get('games/' + $routeParams.gameId).then(function(response) {
                self.game = response.data;
                setWinner(self.game);
                //setNameofTeam(self.game);
				setGameRectangle(self.game);
				aggregateGameStates(self.game);
            });

            self.playGame = function() {
                playGame(self.game);
            };

			self.follow = function(player){
				followPlayer(player);
			};
			
            //this.gameId = $routeParams.gameId;
        }
    ]
});
