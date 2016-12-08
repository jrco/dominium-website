// public/core.js
var dominium = angular.module('dominium', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all games and show them
    $http.get('/games')
        .success(function(data) {
            $scope.games = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}
