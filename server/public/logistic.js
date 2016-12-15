function setWinner(game) {
    console.log(game);
    var ptA = game.gameState[game.gameState.length - 1].teamA.points;
    var ptB = game.gameState[game.gameState.length - 1].teamB.points;
    var td;


    if (ptA > ptB) {
        //console.log("WINNER B");
        td = document.getElementById('winnerA');
    } else if (ptA < ptB) {
        //console.log("WINNER A");
        td = document.getElementById('winnerB');
    }

    td.innerHTML += '<img width="50" width="50" src="../img/trophy.png" class="img-responsive" alt="golden_trophy"/>';
    console.log("WINNER");
}

function getAllPlayers(gamestate) {
    return gamestate.teamA.players.concat(gamestate.teamB.players);
}

/*function setRules(game) {
    var td;
    //var list = getAllPlayers(game.gameState[0]);
    //console.log(list);
    console.log("ENTREI");
    getAllPlayers(game.gameState[0]).forEach(function(player) {
        td = document.getElementById(player.username);
        console.log(td);
        console.log(player.username);
        console.log(player.role);
        if (player.role == "Support") {
            td.innerHTML += '<img width="50" width="50" src="../img/viking.png" class="img-responsive" alt="viking"/>';
        }
        if (player.role == "Attacker") {
            td.innerHTML += '<img width="50" width="50" src="../img/espada.png" class="img-responsive" alt="atracker"/>';
        }
        if (player.role == "Defender") {
            td.innerHTML += '<img width="50" width="50" src="../img/escudo.png" class="img-responsive" alt="defender"/>';
        }

    });
}

function Cenas($route, $routeParams, $location, $scope) {
  this.$route = $route;
  this.$location = $location;
  this.$routeParams = $routeParams;
  $scope.$on('$viewContentLoaded', function(){
    setRules($scope.game);
  });
}*/

