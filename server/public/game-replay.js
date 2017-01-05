var map;

var playerList = {};//username: {marker,info}
var capList = {};//name: {marker, info}

var gameStateDuration = 1000;
var totalDraws = 100;
var timeStep = gameStateDuration / totalDraws;

var dominiumGame;
var currentGameState = 0;

var animationLoop;

function initMap() {
	console.log("LOADING MAP");
    map = new google.maps.Map(document.getElementById('dominium-map'), {
        zoom: 2,
		minZoom: 1,
        center: new google.maps.LatLng(0,0),
        disableDefaultUI: true,
		clickableIcons: false,
		//zoomControl: false,
		//scaleControl: false,
		//scrollwheel: false,
	 	//disableDoubleClickZoom: true,
        mapTypeId: 'satellite'
    });

}

function initializeGame(gamestate) {
    gamestate.corporation.players.forEach(function(player){
        createPlayerMarker(player,"Corporation");
    });
    gamestate.insurgents.players.forEach(function(player){
        createPlayerMarker(player,"Insurgents");
    });

    gamestate.capturePoints.forEach(function(point){
        createCapturePointMarker(point);
    });


    $('span.corporation_points').text(gamestate.corporation.points);
    $('span.insurgents_points').text(gamestate.insurgents.points);

    updateInfos(gamestate);
}

function createAuxData(markers, nextGamestate) {
    var dataAux = {};
    var marker;

    getAllPlayers(nextGamestate).forEach(function (player) {
        marker = markers[player.username].marker;

        dataAux[player.username] = {
            startingPosition: {
                lat: marker.getPosition().lat(),
                lng: marker.getPosition().lng()
            },
            step: {
                lat: (parseFloat(player.lat) - marker.getPosition().lat()) / totalDraws,
                lng: (parseFloat(player.lng) - marker.getPosition().lng()) / totalDraws
            }
        };
    });

    return dataAux;
}

function processGameStates() {
    console.log("Executing "+currentGameState);
    if(currentGameState > dominiumGame.gameState.length-1){
		setWinner(dominiumGame);
        return;
    }

    var gamestate = dominiumGame.gameState[currentGameState++];

    updateInfos(gamestate);
	/*
    gamestate.capturePoints.forEach(function (point) {
       capList[point.name].marker.setLabel(point.teamOwner);
    });
	*/

    var dataAux = createAuxData(playerList, gamestate);
    animationLoop = setTimeout(
        function () {
            moveIteration(gamestate, dataAux, 1);
        }, timeStep
    );
}

function moveIteration(gamestate, dataAux, iteration) {
    if (iteration == totalDraws){
        processGameStates();
        return;
    }

    getAllPlayers(gamestate).forEach(function (player) {
        moveMarker(
            playerList[player.username].marker,
            dataAux[player.username].startingPosition,
            dataAux[player.username].step,
            iteration
        );
    });

   animationLoop = setTimeout(
        function () {
            moveIteration(gamestate, dataAux, iteration + 1);
        }, timeStep
    );
}

function createPlayerMarker(player,team){
    playerList[player.username] = {
        "marker": new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(player.lat),parseFloat(player.lng)),
            icon: (team === "Corporation") ? "https://maps.gstatic.com/mapfiles/ms2/micons/blue.png":"https://maps.gstatic.com/mapfiles/ms2/micons/red.png",
            optimized: false,
            map: map
        }),
        "info": new google.maps.InfoWindow()
    };

    google.maps.event.addListener(playerList[player.username].marker, 'click', function() {
        playerList[player.username].info.open(map,this);
    });
}
function createCapturePointMarker(point){
    capList[point.name] = {
        "marker": new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(point.lat),parseFloat(point.lng)),
            //label: point.teamOwner,
            icon: new google.maps.MarkerImage("../img/diamond_black.png",null,null,null,new google.maps.Size(30, 30)),
            zIndex: -1,
            map: map
        }),
        "info": new google.maps.InfoWindow()
    };

    google.maps.event.addListener(capList[point.name].marker, 'click', function() {
        capList[point.name].info.open(map,this);
    });
}


function updateInfos(gamestate){
    gamestate.capturePoints.forEach(function(point){
        updateCapturePointInfo(point);
    });
    getAllPlayers(gamestate).forEach(function (player) {
        updatePlayerInfo(player);
    });

    $('span.corporation_points').text(gamestate.corporation.points);
    $('span.insurgents_points').text(gamestate.insurgents.points);
}

function updatePlayerInfo(player){
    playerList[player.username].info.setContent(
        '<div>'+
        '<b>'+player.username+' ['+player.role+']</b><br/>'+
        'Energy: '+player.energy+
        '</div>'
    );


	document.getElementById(player.username+"-energy").style["background-color"] = getEnergyColor(player.energy);

	document.getElementById(player.username+"-energy").setAttribute("aria-valuenow",player.energy);
	document.getElementById(player.username+"-energy").style["width"] = player.energy+"%";
	document.getElementById(player.username+"-energy").innerHTML = player.energy;
}
function updateCapturePointInfo(point){
    capList[point.name].info.setContent(
        '<div>'+
        '<b>'+point.name+'</b><br/>'+
        'Energy: '+point.energy+'<br/>'+
        'Controlled by: '+point.teamOwner+
        '</div>'
    );

	capList[point.name].marker.setIcon(
		new google.maps.MarkerImage(getCapturePointIcon(point.teamOwner),null,null,null,new google.maps.Size(30, 30))
	);


	document.getElementById(point.name+"-energy").style["background-color"] = getTeamColorHex(point.teamOwner);
	
	document.getElementById(point.name+"-owner").innerHTML = point.teamOwner;

	document.getElementById(point.name+"-energy").setAttribute("aria-valuenow",point.energy);
	document.getElementById(point.name+"-energy").style["width"] = point.energy+"%";
    $('#'+point.name+'-energy').parent().find('span.value_now').text(point.energy+"%");
}

function moveMarker(marker, start, step, index) {
    marker.setPosition(
        new google.maps.LatLng(
            start.lat + index * step.lat,
            start.lng + index * step.lng
        )
    );
}

function getAllPlayers(gamestate){
    return gamestate.corporation.players.concat(gamestate.insurgents.players);
}

function getCapturePointIcon(teamOwner){
	if(teamOwner === "Corporation"){
		return "../img/diamond_blue.png";
	}
	else if(teamOwner === "Insurgents"){
		return "../img/diamond_red.png";
	}
	else{
		return "../img/diamond_black.png";
	}
}

function getEnergyColor(energy){
	if(energy < 25){
		return "#C04000";
	}
	else if(energy < 50){
		return "#C68E17";
	}
	else if(energy < 75){
		return "#728C00";
	}
	else{
		return "#4CC417";
	}
}

function getTeamColorHex(team){
	if(team === "Corporation"){
		return "#16a085";
	}
	else if(team === "Insurgents"){
		return "#e74c3c";
	}
	else{
		return "#000000";
	}
}

function clearMarkers(){

    for (var key in playerList) {
        if (playerList.hasOwnProperty(key)) {
            playerList[key].marker.setMap(null);
        }
    }
    playerList = {};

    for (var key in capList) {
        if (capList.hasOwnProperty(key)) {
            capList[key].marker.setMap(null);
        }
    }
    capList = {};
}

function setGameRectangle(game){
	var bounds = new google.maps.LatLngBounds();

	game.gameState.forEach(function(gamestate){
		getAllPlayers(gamestate).forEach(function(player){
			bounds.extend(
				new google.maps.LatLng(
					parseFloat(player.lat),
					parseFloat(player.lng)
				)
			);
		});
		gamestate.capturePoints.forEach(function(point){
			bounds.extend(
				new google.maps.LatLng(
					parseFloat(point.lat),
					parseFloat(point.lng)
				)
			);
		});
	});

	map.fitBounds(bounds);
	map.panToBounds(bounds);
}

function playGame(newGame) {
    currentGameState = 0;
    dominiumGame = newGame;

	if(typeof dominiumGame !== 'undefined'){
		clearTimeout(animationLoop);
		clearMarkers();
		initializeGame(dominiumGame.gameState[0]);
		updateInfos(dominiumGame.gameState[0]);
	}

	removeWinner();
    processGameStates();
}
