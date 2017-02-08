function setWinner(game) {
    //console.log(game);
    var ptA = game.gameState[game.gameState.length - 1].corporation.points;
    var ptB = game.gameState[game.gameState.length - 1].insurgents.points;
    var td;

    if (ptA > ptB) {
        //console.log("WINNER B");
        $('.coorporation_fr').addClass('victory');
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

function setNameofTeam(game) {
	var colorMap = {
		"#7ba3eb": "Blue",
		"#83ad7f": "Green",
		"#f2a925": "Orange",
		"#af80af": "Purple",
		"#bb7070": "Red",
		"#f7f55a": "Yellow"
	};

	$( ".coorporation_name" ).append( "<span class='namecp'>"+colorMap[game.gameState[0].corporation.color]+" Team</span>" );
	$( ".insurgents_name" ).append( "<span class='namein'>"+colorMap[game.gameState[0].insurgents.color]+" Team</span>" );

	/*
	$( ".coorporation_img" ).append( "<img ng-src='img/Blue/blue_logo.png' alt='Dominium'>" );
	$( ".insurgents_img" ).append( "<img ng-src='img/Blue/blue_logo.png' alt='Dominium'>" );
	*/
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
}



