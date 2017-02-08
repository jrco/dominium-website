'use strict';

// Register `gameList` component, along with its associated controller and template
angular.
  module('gameList').
  component('gameList', {
    templateUrl: 'game-list/game-list.template.html',
    controller: ['$http',function gameListController($http) {
      var self = this;

      $http.get('/games-short').then(function(response) {
        self.games = response.data;
      });

    self.getCorpResult= function(game){
      var pointsA = game.gameState[0].corporation.points;
      var pointsB = game.gameState[0].insurgents.points;
  
      if(pointsA > pointsB){
        return "victory";
      } else if(pointsA < pointsB){
        return "defeat";
      }
      else{
        return "tie";
      }
    };

    self.getInsResult= function(game){
      var pointsA = game.gameState[0].corporation.points;
      var pointsB = game.gameState[0].insurgents.points;
  
      if(pointsA > pointsB){
        return "defeat";
      } else if(pointsA < pointsB){
        return "victory";
      }
      else{
        return "tie";
      }
    };


	self.allReplayGames= function(){
		self.filter = "replay";
		$('#live-tab').removeClass('selected');
		$('#replay-tab').addClass('selected');	

		$('#live-tab').css('border-left','2px solid rgba(127,140,141,1.0)');
		$('#replay-tab').css('border-right','none');
	}

	self.allLiveGames = function(){
		self.filter = "live";
		$('#replay-tab').removeClass('selected');
		$('#live-tab').addClass('selected');

		$('#replay-tab').css('border-right','2px solid rgba(127,140,141,1.0)');
		$('#live-tab').css('border-left','none');	
	}

	self.getFilter = function(){
		switch(self.filter){
			case "replay":
				return {isGameOver: true};
			case "live":
				return {isGameOver: false};
			default:
				return {};
		}
	}

	self.allReplayGames();

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
