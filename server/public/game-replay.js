var map;

var playerList = {};//username: marker
var capList = {};//name: marker
var circleList = [];

var speed = {
	gameStateDuration: 1000,
	totalDraws: 100,
	timeStep: 10
};

var dominiumGame;
var currentGameState = 0;

var animationData = {
	nextCallback: undefined,
	currentIteration: undefined,
	animationLoop: undefined
};

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

function createAuxData(nextGamestate){
    var dataAux = {};
    var marker;

    getAllPlayers(nextGamestate).forEach(function (player) {
        marker = playerList[player.username];

        dataAux[player.username] = {
            startingPosition: {
                lat: marker.getPosition().lat(),
                lng: marker.getPosition().lng()
            },
            distance: {
                lat: (parseFloat(player.lat) - marker.getPosition().lat()),
                lng: (parseFloat(player.lng) - marker.getPosition().lng())
            }
        };
    });

    return dataAux;
}

function processGameStates() {
    console.log("Executing "+currentGameState);
    if(currentGameState+1 > dominiumGame.gameState.length-1){
		setWinner(dominiumGame);
        return;
    }

    var gamestate = dominiumGame.gameState[++currentGameState];
    updateState(gamestate);

    var dataAux = createAuxData(gamestate);
	animationData.currentIteration = 1;
    moveIteration(gamestate, dataAux);
}

function moveIteration(gamestate, dataAux) {
	//console.log("Processing iteration "+iteration);
	if (animationData.currentIteration == speed.totalDraws){
		clearAnimationState();
		processGameStates();
		return;
	}
	
	getAllPlayers(gamestate).forEach(function (player) {
		var marker = playerList[player.username];
		//console.log("step",dataAux[player.username].step);
		marker.setPosition(
		    new google.maps.LatLng(
		        dataAux[player.username].startingPosition.lat + animationData.currentIteration/speed.totalDraws * dataAux[player.username].distance.lat,
		        dataAux[player.username].startingPosition.lng + animationData.currentIteration/speed.totalDraws * dataAux[player.username].distance.lng
		    )
		);
	});

	animationData.nextCallback = function () {
		moveIteration(gamestate, dataAux);
	};
	animationData.currentIteration++;
	animationData.animationLoop = setTimeout(animationData.nextCallback,speed.timeStep);
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
	var circle = new google.maps.Circle({
		map: map,
		radius: point.radius,
		fillColor: '#44ff00',
		strokeColor: '#ffff00',
		strokeWidth: 6
	});
	circle.bindTo('center', capList[point.name], 'position');

	circleList.push(circle);
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

	circleList.forEach(function(circle){
		circle.setMap(null);
	});
	circleList = [];
}

function clearAnimationState(){
	clearTimeout(animationData.animationLoop);
	animationData = {
		nextCallback: undefined,
		currentIteration: undefined,
		animationLoop: undefined
	};
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

function changeSpeed(scale){
	//scale the speed
	document.getElementById('speed').value *= scale;

	//clamp speed between 1/8 and 8
	var newSpeed = Math.max(1/8,Math.min(document.getElementById('speed').value, 8));
	//set clamped speed in textbox
	document.getElementById('speed').value = newSpeed;

	var newGameStateDuration = 1000/newSpeed;
	var newTotalDraws = parseInt(newGameStateDuration / 10);

	if(typeof animationData.animationLoop !== 'undefined'){
		animationData.currentIteration = parseInt((animationData.currentIteration/speed.totalDraws)*newTotalDraws);
	}

	speed = {
		gameStateDuration: newGameStateDuration,
		totalDraws: newTotalDraws,
		timeStep: 10
	};

	console.log("Speed changed to:",speed);
}

function resumeOrPause(){
	if(typeof animationData.animationLoop !== 'undefined'){
		pause();
	}
	else{
		resume();
	}
}
function pause(){
	clearTimeout(animationData.animationLoop);
	animationData.animationLoop = undefined;
}
function resume(){
	if(typeof animationData.nextCallback !== 'undefined'){
		animationData.nextCallback();
	}
	else{
		document.getElementById("start-button").click();
	}
}

function playGame(newGame) {
    
	if(typeof dominiumGame !== 'undefined'){
		clearMarkers();
	}

	currentGameState = 0;
	dominiumGame = newGame;
	initializeGame(dominiumGame.gameState[0]);

	removeWinner();
    processGameStates();
}
