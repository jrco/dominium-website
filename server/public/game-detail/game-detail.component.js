'use strict';

// Register `gameDetail` component, along with its associated controller and template
angular.
module('gameDetail').
component('gameDetail', {
    templateUrl: 'game-detail/game-detail.template.html',
    controller: ['$http', '$routeParams', '$scope', "$timeout",
        function GameDetailController($http, $routeParams, $scope, $timeout) {
            var self = this;

			$scope.$on('$locationChangeStart', function(event){
				//Clean everything when user leaves
				resetAll();
			});

			initMap();

            $http.get('games/' + $routeParams.gameId).then(function(response) {
                self.game = response.data;

				//TODO remove this when players and points have ids
				self.game.idMap = {
					players: {},
					points: {}
				};

				self.game.gameState[0].corporation.players.concat(self.game.gameState[0].insurgents.players).forEach(function(player,index){
					self.game.idMap.players[player.username] = "player"+index;
				});
				self.game.gameState[0].capturePoints.forEach(function(point,index){
					self.game.idMap.points[point.name] = "point"+index;
				});
				//-------------------------------------------------
			

                setWinner(self.game);
				setGameRectangle(self.game);
				
				//if isLive
				if(!self.game.isGameOver){
					playGame(self.game,false);
				}
				else{
					//Needs to be done after page render
					$timeout(function(){
						aggregateGameStates(self.game);
					},0);
				}
            });

            self.playGame = function(fromStart) {
                playGame(self.game,fromStart);
            };

			self.follow = function(player,team){
				followPlayer(player,team);
			};
			
        }
    ]
});
