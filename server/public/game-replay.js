var map;

var playerList = {};//username: marker
var capList = {};//name: marker
var circleList = [];

var followMarker;

var GAMESTATE_DURATION = 1000;
var INTERVAL_BETWEEN_DRAWS = 20;

var speed = {
	gameStateDuration: GAMESTATE_DURATION,
	totalDraws: parseInt(GAMESTATE_DURATION/INTERVAL_BETWEEN_DRAWS),
};

var dominiumGame;
var currentGameState;

var animationData = {
	nextCallback: undefined,
	currentDraw: undefined,
	animationLoop: undefined
};

//Initializes the google map
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


//Initializes the game, creates all markers
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

    updateState();
}

//Creates auxiliary structure used in moveIteration()
function createAuxData(nextGamestate){
    var dataAux = {};

    getAllPlayers(nextGamestate).forEach(function (player) {
        var marker = playerList[player.username];

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

//Processes the next gamestate acording to the currentGamestate var
function processGameStates() {
    console.log("Executing "+currentGameState);
    if(currentGameState >= dominiumGame.gameState.length-1){
		setWinner(dominiumGame);
        return;
    }

    var gamestate = dominiumGame.gameState[++currentGameState];
    updateState();

    var dataAux = createAuxData(gamestate);
	animationData.currentDraw = 1;
	moveIteration(gamestate, dataAux);
}

//Updates the position of all players according to the currentDraw var (Animation loop)
function moveIteration(gamestate, dataAux) {
	console.log("Processing iteration "+animationData.currentDraw+"/"+speed.totalDraws);
	if (animationData.currentDraw === speed.totalDraws){
		clearAnimationState();
		processGameStates();
		return;
	}
	
	getAllPlayers(gamestate).forEach(function (player) {
		var marker = playerList[player.username];
		var newPos = new google.maps.LatLng(
	        dataAux[player.username].startingPosition.lat + animationData.currentDraw/speed.totalDraws * dataAux[player.username].distance.lat,
	        dataAux[player.username].startingPosition.lng + animationData.currentDraw/speed.totalDraws * dataAux[player.username].distance.lng
	    );
		
		marker.setPosition(newPos);
	});

	if(typeof followMarker !== 'undefined'){
		//map.setCenter(followMarker.getPosition());
		map.panTo(followMarker.getPosition());
	}

	animationData.nextCallback = function () {
		moveIteration(gamestate, dataAux);
	};
	animationData.currentDraw++;
	animationData.animationLoop = setTimeout(animationData.nextCallback,INTERVAL_BETWEEN_DRAWS);
}

//Creates a player marker
function createPlayerMarker(player,team){

    playerList[player.username] = new MarkerWithLabel({
        position: new google.maps.LatLng(parseFloat(player.lat),parseFloat(player.lng)),
        icon: new google.maps.MarkerImage(
			getPlayerMarkerIcon(team),
			null,
			null,
			new google.maps.Point(16,32),
			new google.maps.Size(32,32)
		),
		labelContent: "<span class='text_label'>"+player.username+"</span>",
		labelAnchor: new google.maps.Point(0,50),
		labelClass: "map_label",
        optimized: false,
        map: map
    });
}

//Creates a capture point marker with a circle
function createCapturePointMarker(point){
    capList[point.name] = new MarkerWithLabel({
        position: new google.maps.LatLng(parseFloat(point.lat),parseFloat(point.lng)),
        icon: new google.maps.MarkerImage(
			"../img/diamond_black.png",
			null,
			null,
			new google.maps.Point(15,15),
			new google.maps.Size(30, 30)			
		),
		labelContent: "<span class='text_label'>"+point.name+"</span>",
		labelAnchor: new google.maps.Point(0,50),
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

//Updates the UI/Markers according to the gamestate
function updateState(){
	var gamestate = dominiumGame.gameState[currentGameState];

    gamestate.capturePoints.forEach(function(point){
        updateCapturePointState(point);
    });
    getAllPlayers(gamestate).forEach(function (player) {
        updatePlayerState(player);
    });

    $('span.corporation_points').text(gamestate.corporation.points);
    $('span.insurgents_points').text(gamestate.insurgents.points);
}

//Updates the energy of the player in the UI
function updatePlayerState(player){

	document.getElementById(player.username+"-energy").style["background-color"] = getEnergyColor(player.energy);

	document.getElementById(player.username+"-energy").setAttribute("aria-valuenow",player.energy);
	document.getElementById(player.username+"-energy").style["width"] = player.energy+"%";
	document.getElementById(player.username+"-energy").innerHTML = player.energy;
}

//Updates the marker and UI of capture points
function updateCapturePointState(point){

	capList[point.name].setIcon(new google.maps.MarkerImage(
		getCapturePointIcon(point.teamOwner),
		null,
		null,
		new google.maps.Point(15,15),
		new google.maps.Size(30, 30)			
	));

	//document.getElementById(point.name+"-energy").style["background-color"] = getTeamColorHex(point.teamOwner);
	
	//document.getElementById(point.name+"-owner").innerHTML = point.teamOwner;

	//document.getElementById(point.name+"-energy").setAttribute("aria-valuenow",point.energy);
	//document.getElementById(point.name+"-energy").style["width"] = point.energy+"%";
    //$('#'+point.name+'-energy').parent().find('span.value_now').text(point.energy+"%");

	capList[point.name].set("labelContent","<span class='text_label'>"+point.name+"</span>"+createCapturePointBar(point.teamOwner,point.energy));
}

//Returns all players in a gamestate
function getAllPlayers(gamestate){
    return gamestate.corporation.players.concat(gamestate.insurgents.players);
}

//Creates the HTML element that represents the energy bar of the capture point marker - used by updateCapturePointState()
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

//Gets the correct player icon according to the team
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

//Gets the correct cap point icon according to the team
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

//Gets the correct energy bar color according to the current energy
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

//Gets the correct team color according to the team
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

//Clears all markers from the google map
function clearMarkers(){

    for (var key in playerList) {
        if (playerList.hasOwnProperty(key)) {
            playerList[key].setMap(null);
        }
    }
    playerList = {};
	followMarker = undefined;

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

//Clears all animation data
function clearAnimationState(){
	clearTimeout(animationData.animationLoop);
	animationData = {
		nextCallback: undefined,
		currentDraw: undefined,
		animationLoop: undefined
	};
}

//Adjusts the google map to the existing markers
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

//Change the animation speed
function changeSpeed(scale){
	var newSpeed = document.getElementById('speed').innerHTML * scale;

	//clamp speed between 1/16 and 16
	newSpeed = Math.max(1/16,Math.min(newSpeed, 16));
	document.getElementById('speed').innerHTML = newSpeed;

	var newGameStateDuration = GAMESTATE_DURATION/newSpeed;
	var newTotalDraws = parseInt(newGameStateDuration / INTERVAL_BETWEEN_DRAWS);

	if(typeof animationData.currentDraw !== 'undefined'){
		animationData.currentDraw = parseInt(animationData.currentDraw/speed.totalDraws*newTotalDraws);
	}

	speed = {
		gameStateDuration: newGameStateDuration,
		totalDraws: newTotalDraws
	};

	console.log("Speed changed to:",speed);
}

function followPlayer(username){
	followMarker = playerList[username];
}

//Resume or pause the game
function resumeOrPause(){
	if(typeof animationData.animationLoop !== 'undefined'){
		pause();
	}
	else{
		resume();
	}
}

//Pause the animation
function pause(){
	clearTimeout(animationData.animationLoop);
	animationData.animationLoop = undefined;
}

//Resume the animation, or restart if already finished
function resume(){
	if(typeof animationData.nextCallback !== 'undefined'){
		animationData.nextCallback();
	}
	else{
		document.getElementById("start-button").click();
	}
}

//Start playing a game
function playGame(newGame) {
    
	if(typeof dominiumGame !== 'undefined'){
		clearAnimationState();
		clearMarkers();
	}

	currentGameState = 0;
	dominiumGame = newGame;
	initializeGame(dominiumGame.gameState[0]);

	removeWinner();
    processGameStates();
}
