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
				
				//if isLive
				if(!self.game.isGameOver){
					playGame(self.game,false);
				}
				else{
					aggregateGameStates(self.game);
				}
            });

            self.playGame = function(fromStart) {
                playGame(self.game,fromStart);
            };

			self.follow = function(player,team){
				followPlayer(player,team);
			};
			
            //this.gameId = $routeParams.gameId;
        }
    ]
});
