angular.module('gameController', [])

    .controller('mainController', function($scope, $http, Games) {
        $scope.formData = {};

        // GET =====================================================================
        // when landing on the page, get all todos and show them
        // use the service to get all the todos
        Games.get()
            .success(function(data) {
                $scope.games = data;
            });

    });


        // delete a todo after checking it
        /*$scope.getGame = function(id) {
                $http.get('/games/' + id)
                    .success(function(data) {
                            $scope.games = data;
                    })
                    .error(function(data) {
                            console.log('Error: ' + data);
                    });
        };*/
