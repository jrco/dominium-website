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
				setGameRectangle(self.game);
				aggregateGameStates(self.game);
            });

            self.playGame = function() {
                playGame(self.game);
            };

			self.follow = function(player){
				
				var selectedPlayer = document.getElementById(player+"_selection");

				if(selectedPlayer.style["box-shadow"] === null || selectedPlayer.style["box-shadow"] === ""){
					var players = document.getElementsByClassName("player_selection");
					for (var i = 0; i < players.length; i++) {
						players[i].style.removeProperty("box-shadow");
					}

					selectedPlayer.style["box-shadow"] = "inset 0 0 5px 1px white";
					followPlayer(player);
				}
				else{
					selectedPlayer.style.removeProperty("box-shadow");
					followPlayer(undefined);
				}
			};
			
            //this.gameId = $routeParams.gameId;
        }
    ]
});
