var map;

var playerList = {};//username: marker
var capList = {};//name: marker
var circleList = [];

var followEvent;

var DEFAULT_GAMESTATE_DURATION = 1000;
var currentGameStateDuration = DEFAULT_GAMESTATE_DURATION;

var dominiumGame;
var currentGameState;

var animationData = {
	startTime: undefined,
	timeOffset: 0,
	pauseTime: undefined,
	nextCallback: undefined,
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
	//setWinner(dominiumGame);
	//console.log(dominiumGame);
}


//Initializes the game, creates all markers
function initializeGame() {
	var gamestate = dominiumGame.gameState[0];
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
			start: {
				lat: marker.getPosition().lat(),
				lng: marker.getPosition().lng()
			},
			end: {
				lat: parseFloat(player.lat),
				lng: parseFloat(player.lng)
			}
		};
	});

	return dataAux;
}

//Processes the next gamestate acording to the currentGamestate var
function processGameStates() {
	console.log("Executing "+currentGameState);
	if(currentGameState >= dominiumGame.gameState.length-1){
		stopFollowing();
		setWinner(dominiumGame)
		return;
	}

	var gamestate = dominiumGame.gameState[++currentGameState];
	updateState();

	var dataAux = createAuxData(gamestate);
	animationData.startTime = (new Date()).getTime();

	animationData.nextCallback = function () {
		moveIteration(gamestate, dataAux);
	};
	animationData.animationLoop = window.requestAnimationFrame(animationData.nextCallback);
}

//Updates the position of all players according to the ellapsed time (Animation loop)
function moveIteration(gamestate, dataAux) {
	var ellapsed = (new Date()).getTime()-(animationData.startTime+animationData.timeOffset);
	var progress = ellapsed/currentGameStateDuration;

	//console.log("Current status",progress);
	if (progress > 1){
		progress = 1;
	}
	
	getAllPlayers(gamestate).forEach(function (player) {
		playerList[player.username].setPosition(
			getCurrentPosition(dataAux[player.username].start,dataAux[player.username].end,progress)
		);
	});

	if(progress === 1){
		clearAnimationState();
		processGameStates();
		return;
	}

	animationData.nextCallback = function () {
		moveIteration(gamestate, dataAux);
	};
	animationData.animationLoop = window.requestAnimationFrame(animationData.nextCallback);
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
		return "rgba(39, 174, 96,0.2)";
	}
	else if(energy < 50){
		return "rgba(39, 174, 96,0.5)";
	}
	else if(energy < 75){
		return "rgba(39, 174, 96,0.7)";
	}
	else{
		return "rgba(39, 174, 96,1.0)";
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

//Gets a position based on the starting position, final position, and the % of travel done
function getCurrentPosition(start,end,percent){
	return new google.maps.LatLng(
		start.lat + percent * (end.lat - start.lat),
		start.lng + percent * (end.lng - start.lng)
	)
}

//Clears all markers from the google map
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

//Clears all animation data
function clearAnimationState(){
	window.cancelAnimationFrame(animationData.animationLoop);
	animationData = {
		startTime: undefined,
		timeOffset: 0,
		pauseTime: undefined,
		nextCallback: undefined,
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

	var newGameStateDuration = DEFAULT_GAMESTATE_DURATION/newSpeed;

	var now = animationData.pauseTime || (new Date()).getTime();
	var current = (now-(animationData.startTime+animationData.timeOffset))/currentGameStateDuration;
	animationData.timeOffset = (now-animationData.startTime)-current*newGameStateDuration;
	
	currentGameStateDuration = newGameStateDuration;
	console.log("Speed changed to:",currentGameStateDuration);
}

//Stops following players
function stopFollowing(){
	
	
	var players = document.getElementsByClassName("player_selection");
	for (var i = 0; i < players.length; i++) {
		players[i].style.removeProperty("box-shadow");
	}

	if(typeof followEvent !== 'undefined'){
		google.maps.event.removeListener(followEvent);
		followEvent = undefined;
	}
}

//Follow a player
function followPlayer(player){
	var selectedPlayer = document.getElementById(player+"_selection");

	if(selectedPlayer.style["box-shadow"] === null || selectedPlayer.style["box-shadow"] === ""){
		stopFollowing();

		var marker = playerList[player];
		if(typeof marker === 'undefined'){
			return;
		}

		selectedPlayer.style["box-shadow"] = "inset 0 0 5px 1px white";

		map.panTo(marker.getPosition());
		followEvent = marker.addListener('position_changed', function(){
			map.panTo(marker.getPosition());
		});
	}
	else{
		stopFollowing();
	}
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
	animationData.pauseTime = (new Date()).getTime();
	window.cancelAnimationFrame(animationData.animationLoop);
	animationData.animationLoop = undefined;
}

//Resume the animation, or restart if already finished
function resume(){
	if(typeof animationData.nextCallback !== 'undefined'){
		animationData.timeOffset += (new Date()).getTime()-animationData.pauseTime;
		pauseTime = undefined;
		animationData.animationLoop = window.requestAnimationFrame(animationData.nextCallback);
	}
	else{
		document.getElementById("start-button").click();
	}
}

//Start playing a game
function playGame(newGame) {
	
	if(typeof dominiumGame !== 'undefined'){
		clearAnimationState();
		stopFollowing();
		clearMarkers();
	}

	currentGameState = 0;
	dominiumGame = newGame;
	initializeGame();

	removeWinner();
	processGameStates();
}
