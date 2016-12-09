// js/services/games.js
angular.module('gameService', [])

    // super simple service
    // each function returns a promise object 
    .factory('Games', function($http) {
        return {
            get : function() {
                return $http.get('/games');
            }//,
            /*get : function(id) {
                return $http.get('/games/' + id);
            }*/
        }
    });