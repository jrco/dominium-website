var map;

var playerList = {};//username: marker
var capList = {};//name: marker

var speed = {
	gameStateDuration: 1000,
	totalDraws: 100,
	timeStep: 10
};

var dominiumGame;
var currentGameState = 0;

var nextCallback;
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

    updateState(gamestate);
}

function createAuxData(nextGamestate,speed) {
    var dataAux = {};
    var marker;

    getAllPlayers(nextGamestate).forEach(function (player) {
        marker = playerList[player.username];

        dataAux[player.username] = {
            startingPosition: {
                lat: marker.getPosition().lat(),
                lng: marker.getPosition().lng()
            },
            step: {
                lat: (parseFloat(player.lat) - marker.getPosition().lat()) / speed.totalDraws,
                lng: (parseFloat(player.lng) - marker.getPosition().lng()) / speed.totalDraws
            }
        };
    });

    return dataAux;
}

function processGameStates() {
    console.log("Executing "+currentGameState);
    if(currentGameState > dominiumGame.gameState.length-1){
		setWinner(dominiumGame);
		nextCallback = undefined;
        return;
    }

    var gamestate = dominiumGame.gameState[currentGameState++];
    updateState(gamestate);

	var currentSpeed = $.extend(true, {}, speed);

    var dataAux = createAuxData(gamestate, currentSpeed);
    moveIteration(gamestate, dataAux, 1, currentSpeed);
}

function moveIteration(gamestate, dataAux, iteration, currentSpeed) {
	//console.log("Processing iteration "+iteration);
	if (iteration == currentSpeed.totalDraws){
		processGameStates();
		return;
	}

	getAllPlayers(gamestate).forEach(function (player) {
		var marker = playerList[player.username];
		marker.setPosition(
		    new google.maps.LatLng(
		        dataAux[player.username].startingPosition.lat + iteration * dataAux[player.username].step.lat,
		        dataAux[player.username].startingPosition.lng + iteration * dataAux[player.username].step.lng
		    )
		);
	});

	nextCallback = function () {
		moveIteration(gamestate, dataAux, iteration + 1, currentSpeed);
	};
	animationLoop = setTimeout(nextCallback,currentSpeed.timeStep);
}


function createPlayerMarker(player,team){

    playerList[player.username] = new MarkerWithLabel({
        position: new google.maps.LatLng(parseFloat(player.lat),parseFloat(player.lng)),
        icon: getPlayerMarkerIcon(team),
		labelContent: "<span class='text_label'>"+player.username+"</span>",
		labelAnchor: new google.maps.Point(0,50),
		labelClass: "map_label",
        optimized: false,
        map: map
    });
}
function createCapturePointMarker(point){
    capList[point.name] = new MarkerWithLabel({
        position: new google.maps.LatLng(parseFloat(point.lat),parseFloat(point.lng)),
        icon: new google.maps.MarkerImage("../img/diamond_black.png",null,null,null,new google.maps.Size(30, 30)),
		labelContent: "<span class='text_label'>"+point.name+"</span>",
		labelAnchor: new google.maps.Point(0,60),
		labelClass: "map_label",
		zIndex: -1,
        map: map
    });
	new google.maps.Circle({
		map: map,
		radius: point.radius,
		fillColor: '#44ff00',
		strokeColor: '#ffff00',
		strokeWidth: 6
	}).bindTo('center', capList[point.name], 'position');
}


function updateState(gamestate){
    gamestate.capturePoints.forEach(function(point){
        updateCapturePointState(point);
    });
    getAllPlayers(gamestate).forEach(function (player) {
        updatePlayerState(player);
    });

    $('span.corporation_points').text(gamestate.corporation.points);
    $('span.insurgents_points').text(gamestate.insurgents.points);
}

function updatePlayerState(player){

	document.getElementById(player.username+"-energy").style["background-color"] = getEnergyColor(player.energy);

	document.getElementById(player.username+"-energy").setAttribute("aria-valuenow",player.energy);
	document.getElementById(player.username+"-energy").style["width"] = player.energy+"%";
	document.getElementById(player.username+"-energy").innerHTML = player.energy;
}
function updateCapturePointState(point){

	capList[point.name].setIcon(
		new google.maps.MarkerImage(getCapturePointIcon(point.teamOwner),null,null,null,new google.maps.Size(30, 30))
	);

	document.getElementById(point.name+"-energy").style["background-color"] = getTeamColorHex(point.teamOwner);
	
	document.getElementById(point.name+"-owner").innerHTML = point.teamOwner;

	document.getElementById(point.name+"-energy").setAttribute("aria-valuenow",point.energy);
	document.getElementById(point.name+"-energy").style["width"] = point.energy+"%";
    $('#'+point.name+'-energy').parent().find('span.value_now').text(point.energy+"%");

	capList[point.name].set("labelContent","<span class='text_label'>"+point.name+"</span>"+createCapturePointBar(point.teamOwner,point.energy));
}


function getAllPlayers(gamestate){
    return gamestate.corporation.players.concat(gamestate.insurgents.players);
}

function createCapturePointBar(team,energy){
	var corpEnergy = 0;
	var insEnergy = 0;
	
	if(team === "Corporation"){
		corpEnergy = energy;
	}
	else if(team === "Insurgents"){
		insEnergy = energy
	}

	return "\
	<table class='energy-progress-bar'>\
		<tr>\
			<td>\
				<div style='width:"+corpEnergy+"%;'>&nbsp;</div>\
				<span>"+corpEnergy+"</span>\
			</td>\
			<td>\
				<div style='width:"+insEnergy+"%;'>&nbsp;</div>\
				<span>"+insEnergy+"</span>\
			</td>\
		</tr>\
	</div>";
}

function getPlayerMarkerIcon(team){
	if(team === "Corporation"){
		return "https://maps.gstatic.com/mapfiles/ms2/micons/blue.png";
	}
	else if(team === "Insurgents"){
		return "https://maps.gstatic.com/mapfiles/ms2/micons/red.png";
	}
	else{
		return "https://maps.gstatic.com/mapfiles/ms2/micons/green.png";
	}
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
            playerList[key].setMap(null);
        }
    }
    playerList = {};

    for (var key in capList) {
        if (capList.hasOwnProperty(key)) {
            capList[key].setMap(null);
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

function changeSpeed(){
	var newSpeed = 1/document.getElementById("speed").value;

	var newGameStateDuration = newSpeed * 1000;
	var newTotalDraws = newGameStateDuration / 10;
	var newTimeStep = newGameStateDuration / newTotalDraws;


	speed = {
		gameStateDuration: newGameStateDuration,
		totalDraws: newTotalDraws,
		timeStep: newTimeStep
	};
	console.log("Speed changed to:",speed);
}

function resumeOrPause(){
	if(typeof animationLoop !== 'undefined'){
		pause();
	}
	else{
		resume();
	}
}
function pause(){
	clearTimeout(animationLoop);
	animationLoop = undefined;
}
function resume(){
	if(typeof nextCallback !== 'undefined'){
		nextCallback();
	}
	else{
		document.getElementById("start-button").click();
	}
}

function playGame(newGame) {
    
	if(typeof dominiumGame !== 'undefined'){
		clearTimeout(animationLoop);
		animationLoop = undefined;
		clearMarkers();
	}

	currentGameState = 0;
	dominiumGame = newGame;
	initializeGame(dominiumGame.gameState[0]);

	removeWinner();
	currentGameState = 1;
    processGameStates();
}
