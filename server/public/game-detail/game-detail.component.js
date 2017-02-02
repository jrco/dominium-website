'use strict';

// Register `gameDetail` component, along with its associated controller and template
angular.
module('gameDetail').
component('gameDetail', {
    templateUrl: 'game-detail/game-detail.template.html',
    controller: ['$http', '$routeParams', '$scope',
        function GameDetailController($http, $routeParams, $scope) {
            var self = this;

			$scope.$on('$locationChangeStart', function(event){
				//Clean everything when user leaves
				resetAll();
			});

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
