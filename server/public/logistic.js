function setWinner(game) {
    console.log(game);
    var ptA = game.gameState[game.gameState.length - 1].corporation.points;
    var ptB = game.gameState[game.gameState.length - 1].insurgents.points;
    var td;

    if (ptA > ptB) {
        //console.log("WINNER B");
        /*$('.winner_cp').addClass('won');*/
        $('.coorporation_fr').addClass('victory');
        //$( ".coorporation_fr" ).remove();
        $( ".coorporation_fr" ).append( "Victory" );
        $('.insurgents_fr').addClass('defeat');
        $( ".insurgents_fr" ).append( "Defeat" );
    } else if (ptA < ptB) {
        //console.log("WINNER A");
        $( ".coorporation_fr" ).addClass( "defeat" );
        $( ".coorporation_fr" ).append( "Defeat" );
        $( ".insurgents_fr" ).addClass( "victory" );
        $( ".insurgents_fr" ).append( "Victory" );
    } else {
        
        $( ".coorporation_fr" ).append( "Tie" );
        $( ".insurgents_fr" ).append( "Tie" );
    }
}

function removeWinner(){
    $( ".coorporation_fr" ).removeClass("defeat");
    $( ".coorporation_fr" ).removeClass("victory");
    $( ".coorporation_fr" ).removeClass("tie");
    $( ".insurgents_fr" ).removeClass("defeat");
    $( ".insurgents_fr" ).removeClass("victory");
    $( ".insurgents_fr" ).removeClass("tie");

    $( ".coorporation_fr" ).empty();
    $( ".insurgents_fr" ).empty();

}

function getAllPlayers(gamestate) {
    return gamestate.corporation.players.concat(gamestate.insurgents.players);
}

$('a').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 500);
    return false;
});



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

