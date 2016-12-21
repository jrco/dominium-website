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
		zoomControl: false,
		scaleControl: false,
		scrollwheel: false,
	 	disableDoubleClickZoom: true
    });
}

function initializeGame(gamestate) {
    var pointsA;
    var pointsB;
    gamestate.corporation.players.forEach(function(player){
        createPlayerMarker(player,"Corporation");
    });
    gamestate.insurgents.players.forEach(function(player){
        createPlayerMarker(player,"Insurgents");
    });

    gamestate.capturePoints.forEach(function(point){
        createCapturePointMarker(point);
    });

    document.getElementById('a_points').innerHTML = gamestate.corporation.points;
    document.getElementById('b_points').innerHTML = gamestate.insurgents.points;

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
    if(dominiumGame.gameState.length <= currentGameState){
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
            icon: new google.maps.MarkerImage("../img/capPoint.svg",null,null,null,new google.maps.Size(30, 30)),
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
    var pointsA;
    var pointsA
    gamestate.capturePoints.forEach(function(point){
        updateCapturePointInfo(point);
    });
    getAllPlayers(gamestate).forEach(function (player) {
        updatePlayerInfo(player);
    });

    document.getElementById('a_points').innerHTML = gamestate.corporation.points;
    document.getElementById('b_points').innerHTML = gamestate.insurgents.points;
}

function updatePlayerInfo(player){
    var energyP;
    playerList[player.username].info.setContent(
        '<div>'+
        '<b>'+player.username+' ['+player.role+']</b><br/>'+
        'Energy: '+player.energy+
        '</div>'
    );

	var color;	
	if(player.energy < 25){
		color = "#C04000";
	}
	else if(player.energy < 50){
		color = "#C68E17";
	}
	else if(player.energy < 75){
		color = "#728C00";
	}
	else{
		color = "#4CC417";
	}

	document.getElementById(player.username+"-energy").style["background-color"] = color;

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


	if(point.teamOwner === "Corporation"){
		document.getElementById(point.name+"-energy").style["background-color"] = "#16a085";
	}
	else{
		document.getElementById(point.name+"-energy").style["background-color"] = "#e74c3c";
	}

	document.getElementById(point.name+"-owner").innerHTML = point.teamOwner;

	document.getElementById(point.name+"-energy").setAttribute("aria-valuenow",point.energy);
	document.getElementById(point.name+"-energy").style["width"] = point.energy+"%";
	document.getElementById(point.name+"-energy").innerHTML = point.energy;
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

	console.log(bounds);
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
