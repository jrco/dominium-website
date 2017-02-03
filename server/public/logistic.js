function setWinner(game) {
    //console.log(game);
    var ptA = game.gameState[game.gameState.length - 1].corporation.points;
    var ptB = game.gameState[game.gameState.length - 1].insurgents.points;
    var td;

    if (ptA > ptB) {
        //console.log("WINNER B");
        /*$('.winner_cp').addClass('won');*/
        $('.coorporation_fr').addClass('victory');
        //$( ".coorporation_fr" ).remove();
        $( ".coorporation_fr" ).html( "Victory" );
        $('.insurgents_fr').addClass('defeat');
        $( ".insurgents_fr" ).html( "Defeat" );
    } else if (ptA < ptB) {
        //console.log("WINNER A");
        $( ".coorporation_fr" ).addClass( "defeat" );
        $( ".coorporation_fr" ).html( "Defeat" );
        $( ".insurgents_fr" ).addClass( "victory" );
        $( ".insurgents_fr" ).html( "Victory" );
    } else {
        $( ".coorporation_fr" ).addClass( "tie" );
        $( ".coorporation_fr" ).html( "Tie" );
        $( ".insurgents_fr" ).addClass( "tie" );
        $( ".insurgents_fr" ).html( "Tie" );
    }
}

function setColorToDiv(game){
    
}


function setNameofTeam(game) {
    console.log(game.gameState[0].corporation.color);
    console.log(game.gameState[0].insurgents.color);
    /* BLUE */
    if (game.gameState[0].corporation.color == "#7ba3eb") {
        $( ".coorporation_name" ).append( "<span class='namecp'>Blue Team</span>" );
        $( ".coorporation_img" ).append( "<img ng-src='img/Blue/blue_logo.png' alt='Dominium'>" );
    }
    if (game.gameState[0].insurgents.color == "#7ba3eb") {
        $( ".insurgents_name" ).append( "<span class='namein'>Blue Team</span>" );
        $( ".insurgents_img" ).append( "<img ng-src='img/Blue/blue_logo.png' alt='Dominium'>" );
        /*Green*/
    }
    if (game.gameState[0].corporation.color == "#83ad7f") {
        $( ".coorporation_name" ).append( "<span class='namecp'>Green Team</span>" );
    }
    if (game.gameState[0].insurgents.color == "#83ad7f") {
        $( ".insurgents_name" ).append( "<span class='namein'>Green Team</span>" );
        /* Orange*/
    }
    if (game.gameState[0].corporation.color == "#f2a925") {
        $( ".coorporation_name" ).append( "<span class='namecp'>Orange Team</span>" );
    }
    if (game.gameState[0].insurgents.color == "#f2a925") {
        $( ".insurgents_name" ).append( "<span class='namein'>Orange Team</span>" );
        /* Purple*/
    }
    if (game.gameState[0].corporation.color == "#af80af") {
        $( ".coorporation_name" ).append( "<span class='namecp'>Purple Team</span>" );
    }
    if (game.gameState[0].insurgents.color == "#af80af") {
        $( ".insurgents_name" ).append( "<span class='namein'>Purple Team</span>" );
        /* Red */
    }
    if (game.gameState[0].corporation.color == "#bb7070") {
        $( ".coorporation_name" ).append( "<span class='namecp'>   Red Team</span>" );
    }
    if (game.gameState[0].insurgents.color == "#bb7070") {
        $( ".insurgents_name" ).append( "<span class='namein'>Red Team</span>" );
        /* Yellow */
    } if (game.gameState[0].corporation.color == "#f7f55a") {
        $( ".coorporation_name" ).append( "<span class='namecp'>Yellow Team</span>" );
    }
    if (game.gameState[0].insurgents.color == "#f7f55a") {
        $( ".insurgents_name" ).append( "<span class='namein'>Yellow Team</span>" );
    } 
}

function removeWinner(){
    $( ".coorporation_fr" ).removeClass("defeat");
    $( ".coorporation_fr" ).removeClass("victory");
    $( ".coorporation_fr" ).removeClass("tie");
    $( ".insurgents_fr" ).removeClass("defeat");
    $( ".insurgents_fr" ).removeClass("victory");
    $( ".insurgents_fr" ).removeClass("tie");

	$( ".coorporation_fr" ).html("&nbsp;");
    $( ".insurgents_fr" ).html("&nbsp;");
/*
    $( ".coorporation_fr" ).empty();
    $( ".insurgents_fr" ).empty();
*/
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

/*function stopFollowing() {

    $(".player_selection").each(function(i,obj){
        obj.style.removeProperty("box-shadow");
    });

    if (typeof followEvent !== 'undefined') {
        google.maps.event.removeListener(followEvent);
        followEvent = undefined;
    }
}*/

