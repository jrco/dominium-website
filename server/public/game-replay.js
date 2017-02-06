var map;

var playerList = {}; //username: marker
var capList = {}; //name: {marker,circle}

var followEvent;

var DEFAULT_GAMESTATE_DURATION = 1000;
var currentGameStateDuration = DEFAULT_GAMESTATE_DURATION;

var dominiumGame;
var currentGameState;
var requestEvent;

var colors = {
	corporation: "#FFFFFF",
	insurgents: "#000000"
};

var animationData = {
    startTime: undefined,
    timeOffset: 0,
    pauseTime: undefined,
    nextCallback: undefined,
    animationLoop: undefined
};

var markerVars = {
    playerWidth: 32,
    playerHeight: 64,
    playerLabelOffset: 85,
    pointWidth: 48,
    pointHeight: 96,
    pointLabelOffset: 125
}

//Initializes the google map
function initMap() {
    console.log("LOADING MAP");
    
	var styledMapType = new google.maps.StyledMapType(
        [{
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
            }, {
                "color": "#000000"
            }, {
                "lightness": 40
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }, {
                "weight": 1.2
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 21
            }]
        }, {
            "featureType": "poi.business",
            "elementType": "all",
            "stylers": [{
                "saturation": "-100"
            }, {
                "lightness": "-100"
            }, {
                "color": "#050000"
            }, {
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.business",
            "elementType": "geometry",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.business",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.business",
            "elementType": "geometry.stroke",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.business",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.business",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.business",
            "elementType": "labels.text.fill",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.business",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.business",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.park",
            "elementType": "all",
            "stylers": [{
                "visibility": "simplified"
            }, {
                "color": "#365631"
            }, {
                "weight": "1.08"
            }, {
                "saturation": "-13"
            }, {
                "lightness": "-24"
            }, {
                "gamma": "1.76"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 29
            }, {
                "weight": 0.2
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 18
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 19
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#0f252e"
            }, {
                "lightness": 17
            }]
        }], { name: 'Dominium Map' });


    map = new google.maps.Map(document.getElementById('dominium-map'), {
        zoom: 2,
        minZoom: 1,
        center: new google.maps.LatLng(0, 0),
        disableDefaultUI: true,
        clickableIcons: false,
		rotateControl: true,
        //zoomControl: false,
        //scaleControl: false,
        //scrollwheel: false,
        //disableDoubleClickZoom: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'dominium_map'],
            position: google.maps.ControlPosition.TOP_LEFT
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        addressControlOptions: {
        	position: google.maps.ControlPosition.BOTTOM_CENTER, // <- change position
        }
    });
    //setWinner(dominiumGame);
    //console.log(dominiumGame);
    map.mapTypes.set('dominium_map', styledMapType);
    map.setMapTypeId('dominium_map');

	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center); 
	});
}


//Initializes the game, creates all markers
function initializeGame() {
    var gamestate = dominiumGame.gameState[currentGameState];
	colors.corporation = gamestate.corporation.color;
	colors.insurgents = gamestate.insurgents.color;

    gamestate.corporation.players.forEach(function(player) {
        createPlayerMarker(player,"corporation");
    });
    gamestate.insurgents.players.forEach(function(player) {
        createPlayerMarker(player,"insurgents");
    });

    gamestate.capturePoints.forEach(function(point) {
        createCapturePointMarker(point);
    });


    $('span.corporation_points').text(gamestate.corporation.points);
    $('span.insurgents_points').text(gamestate.insurgents.points);

    updateState(gamestate);
}

//Creates auxiliary structure used in moveIteration()
function createAuxData(nextGamestate) {
    var dataAux = {};

    getAllPlayers(nextGamestate).forEach(function(player) {
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

function getNextGameState(){
	console.log("Trying to fetch gamestate "+(currentGameState+1));
	$.ajax({
        url: "/games/"+dominiumGame._id+"/gamestate/"+(currentGameState+1),
        type: 'get',
        success: function(data){
			console.log(data);
			if(data.isFinal === false && typeof data.gameState === 'undefined'){
				requestEvent = setTimeout(function(){
					getNextGameState();
				},1000);
				return;
			}

			if(data.isFinal === true){
				dominiumGame.isGameOver = true;
			}
			if(typeof data.gameState !== 'undefined'){
				dominiumGame.gameState.push(data.gameState);
			}

			processGameStates();
        },
		error: function(xhr,status,error){
			console.log("Error on get");
		}
    });
}

//Processes the next gamestate acording to the currentGamestate var
function processGameStates() {
    removeWinner();
	
    console.log("Executing " + (currentGameState +1));
	if(currentGameState+1 > dominiumGame.gameState.length - 1){
		if(dominiumGame.isGameOver === true){
			console.log("Game is over");
			stopFollowing();
        	setWinner(dominiumGame);
		}
		else{
			console.log("Game is not over, requesting next GS");
			getNextGameState();
		}
		return;
	}
	currentGameState++;
	console.log("I have it, running the GS");

    var gamestate = dominiumGame.gameState[currentGameState];
    updateState(gamestate);

    var dataAux = createAuxData(gamestate);
    animationData.startTime = (new Date()).getTime();

    animationData.nextCallback = function() {
        moveIteration(gamestate, dataAux);
    };
    animationData.animationLoop = window.requestAnimationFrame(animationData.nextCallback);
}

//Updates the position of all players according to the ellapsed time (Animation loop)
function moveIteration(gamestate, dataAux) {
    var ellapsed = (new Date()).getTime() - (animationData.startTime + animationData.timeOffset);
    var progress = ellapsed / currentGameStateDuration;

    //console.log("Current status",progress);
    if (progress > 1) {
        progress = 1;
    }

    getAllPlayers(gamestate).forEach(function(player) {
        playerList[player.username].setPosition(
            getCurrentPosition(dataAux[player.username].start, dataAux[player.username].end, progress)
        );
    });

    if (progress === 1) {
        clearAnimationState();
        processGameStates();
        return;
    }

    animationData.nextCallback = function() {
        moveIteration(gamestate, dataAux);
    };
    animationData.animationLoop = window.requestAnimationFrame(animationData.nextCallback);
}

//Creates a player marker
function createPlayerMarker(player, team) {

    playerList[player.username] = new MarkerWithLabel({
        position: new google.maps.LatLng(parseFloat(player.lat), parseFloat(player.lng)),
        icon: new google.maps.MarkerImage(
            //"/img/player/"+encodeURIComponent(color)+"_"+player.role+".png",
            "/img/player/" + encodeURIComponent(colors[team]) + ".png",
            null,
            null,
            new google.maps.Point(markerVars.playerWidth / 2, markerVars.playerHeight),
            new google.maps.Size(markerVars.playerWidth, markerVars.playerHeight)
        ),
        labelContent: "<span class='text_label'>" + player.username + "</span>",
        labelAnchor: new google.maps.Point(0, markerVars.playerLabelOffset),
        labelClass: "map_label",
        optimized: false,
		clickable: false,
        map: map
    });
}

//Creates a capture point marker with a circle
function createCapturePointMarker(point) {
    capList[point.name] = {};
    capList[point.name].marker = new MarkerWithLabel({
        position: new google.maps.LatLng(parseFloat(point.lat), parseFloat(point.lng)),
        icon: new google.maps.MarkerImage(
            "/img/point/neutral.png",
            null,
            null,
            new google.maps.Point(markerVars.pointWidth / 2, markerVars.pointHeight),
            new google.maps.Size(markerVars.pointWidth, markerVars.pointHeight)
        ),
        labelContent: "<span class='text_label'>" + point.name + "</span>"+getCapturePointBar(point),
        labelAnchor: new google.maps.Point(0, markerVars.pointLabelOffset),
        labelClass: "map_label",
        zIndex: -1,
		clickable: false,
        map: map
    });
    capList[point.name].circle = new google.maps.Circle({
        map: map,
        radius: point.radius,
        fillColor: '#FFFFFF',
        strokeColor: '#000000',
        strokeWidth: 6
    });
    capList[point.name].circle.bindTo('center', capList[point.name].marker, 'position');
}

//Creates the energy bar label
function getCapturePointBar(point){
	return "\
		<div id='"+point.name+"-label' class='energy-progress-bar'>\
			<div class='progress'>\
				<div  id='"+point.name+"-bar-corporation' class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width:0%;background-color:" + colors.corporation + ";'></div>\
				<span id='"+point.name+"-energy-corporation'>0</span>\
			</div>\
			<div class='progress'>\
				<div  id='"+point.name+"-bar-insurgents' class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width:0%;background-color:" + colors.insurgents + ";'></div>\
				<span id='"+point.name+"-energy-insurgents'>0</span>\
			</div>\
		</div>";
}

//Updates the UI/Markers according to the gamestate
function updateState(gamestate) {

    gamestate.capturePoints.forEach(function(point) {
        updateCapturePointState(point);
    });
    gamestate.corporation.players.forEach(function(player) {
        updatePlayerState(player);
    });
	gamestate.insurgents.players.forEach(function(player) {
        updatePlayerState(player);
    });

    $(".coorporation_result span").text(gamestate.corporation.points);
    $(".insurgents_result span").text(gamestate.insurgents.points);

    //$('span.coorporation_result').text(gamestate.corporation.points);
    //$('span.insurgents_result').text(gamestate.insurgents.points);
}

//Updates the energy of the player in the UI
function updatePlayerState(player) {

    $("#"+player.username + "-bar").css("opacity", player.energy/50);
    $("#"+player.username + "-bar").attr("aria-valuenow", player.energy);
    $("#"+player.username + "-bar").css("width", player.energy + "%");
    $("#"+player.username + "-energy").html(player.energy);
}

//Updates the capture points
function updateCapturePointState(point) {

    //Update marker icon
    capList[point.name].marker.setIcon(new google.maps.MarkerImage(
        getCapturePointIcon(point.teamOwner),
        null,
        null,
        new google.maps.Point(markerVars.pointWidth / 2, markerVars.pointHeight),
        new google.maps.Size(markerVars.pointWidth, markerVars.pointHeight)
    ));

    //Update circle fill color
    if (point.teamOwner === "Corporation") {
        capList[point.name].circle.setOptions({ fillColor: colors.corporation, strokeColor: colors.corporation});
    } else if (point.teamOwner === "Insurgents") {
        capList[point.name].circle.setOptions({ fillColor: colors.insurgents, strokeColor: colors.insurgents});
    } else {
        capList[point.name].circle.setOptions({ fillColor: '#FFFFFF', strokeColor: '#000000'});
    }

	//Update energy bar
	updateCapturePointBar(point);
}

//Updates the energy bar label of a capture point
function updateCapturePointBar(point) {
    var corpEnergy = 0;
    var insEnergy = 0;

    if (point.teamOwner === "Corporation") {
        corpEnergy = point.energy;
    } else if (point.teamOwner === "Insurgents") {
        insEnergy = point.energy
    }

	
	$("#"+point.name + "-bar-corporation").attr("aria-valuenow", corpEnergy);
	$("#"+point.name + "-bar-corporation").css("width", corpEnergy + "%");
	$("#"+point.name + "-energy-corporation").html(corpEnergy);

	$("#"+point.name + "-bar-insurgents").attr("aria-valuenow", insEnergy);
	$("#"+point.name + "-bar-insurgents").css("width", insEnergy + "%");
	$("#"+point.name + "-energy-insurgents").html(insEnergy);

	//Update label stored in MarkerLabel - The label was reset on zoom
	var elem = $("#"+point.name + "-label").prop('outerHTML');
	if(typeof elem !== 'undefined'){
		capList[point.name].marker.labelContent = elem;
	}
}

//Returns all players in a gamestate
function getAllPlayers(gamestate) {
    return gamestate.corporation.players.concat(gamestate.insurgents.players);
}

//Gets the correct cap point icon according to the team
function getCapturePointIcon(teamOwner) {
    if (teamOwner === "Corporation") {
        return "/img/point/" + encodeURIComponent(colors.corporation) + ".png";
    } else if (teamOwner === "Insurgents") {
        return "/img/point/" + encodeURIComponent(colors.insurgents) + ".png";
    } else {
        return "/img/point/neutral.png";
    }
}


//Gets a position based on the starting position, final position, and the % of travel done
function getCurrentPosition(start, end, percent) {
    return new google.maps.LatLng(
        start.lat + percent * (end.lat - start.lat),
        start.lng + percent * (end.lng - start.lng)
    )
}

//Clears all markers from the google map
function clearMarkers() {

    for (var key in playerList) {
        if (playerList.hasOwnProperty(key)) {
            playerList[key].setMap(null);
        }
    }
    playerList = {};

    for (var key in capList) {
        if (capList.hasOwnProperty(key)) {
            capList[key].marker.setMap(null);
            capList[key].circle.setMap(null);
        }
    }
    capList = {};
}

//Clears all animation data
function clearAnimationState() {
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
function setGameRectangle(game) {
    var bounds = new google.maps.LatLngBounds();

    game.gameState.forEach(function(gamestate) {
        getAllPlayers(gamestate).forEach(function(player) {
            bounds.extend(
                new google.maps.LatLng(parseFloat(player.lat), parseFloat(player.lng))
            );
        });
        gamestate.capturePoints.forEach(function(point) {
            bounds.extend(
                new google.maps.LatLng(parseFloat(point.lat), parseFloat(point.lng))
            );
        });
    });

    map.fitBounds(bounds);
    map.panToBounds(bounds);
}

//Change the animation speed
function changeSpeed(scale) {
    var newSpeed = $('#speed').html() * scale;

    //clamp speed between 1/16 and 16
    newSpeed = Math.max(1 / 16, Math.min(newSpeed, 16));
    $('#speed').html(newSpeed);

    var newGameStateDuration = DEFAULT_GAMESTATE_DURATION / newSpeed;

    var now = animationData.pauseTime || (new Date()).getTime();
    var current = (now - (animationData.startTime + animationData.timeOffset)) / currentGameStateDuration;
    animationData.timeOffset = (now - animationData.startTime) - current * newGameStateDuration;

    currentGameStateDuration = newGameStateDuration;
    console.log("Speed changed to:", currentGameStateDuration);
}

//Stops following players
function stopFollowing() {

    $(".player_selection").each(function(i,obj){
        obj.style.removeProperty("box-shadow");
    });

    if (typeof followEvent !== 'undefined') {
        google.maps.event.removeListener(followEvent);
        followEvent = undefined;
    }
}

//Follow a player
function followPlayer(player,team) {
    var selectedPlayer = document.getElementById(player + "_selection");

    if (selectedPlayer.style["box-shadow"] === null || selectedPlayer.style["box-shadow"] === "") {
        stopFollowing();

        var marker = playerList[player];
        if (typeof marker === 'undefined') {
            return;
        }

        selectedPlayer.style["box-shadow"] = "inset 0 0 8px 3px "+colors[team];

        map.panTo(marker.getPosition());
        followEvent = marker.addListener('position_changed', function() {
            map.panTo(marker.getPosition());
        });
    } else {
        stopFollowing();
    }
}

//Resume or pause the game
function resumeOrPause() {
    if (typeof animationData.animationLoop !== 'undefined') {
        pause();
    } else {
        resume();
    }
}

//Pause the animation
function pause() {
	clearTimeout(requestEvent);
    animationData.pauseTime = (new Date()).getTime();
    window.cancelAnimationFrame(animationData.animationLoop);
    animationData.animationLoop = undefined;
}

//Resume the animation, or restart if already finished
function resume() {
    if (typeof animationData.nextCallback !== 'undefined') {
        animationData.timeOffset += (new Date()).getTime() - animationData.pauseTime;
        pauseTime = undefined;
        animationData.animationLoop = window.requestAnimationFrame(animationData.nextCallback);
    } else {
        $("#start-button").click();
    }
}

function resetAll(){
	stopFollowing();
	clearAnimationState();
	clearMarkers();
	currentGameStateDuration = DEFAULT_GAMESTATE_DURATION;
	clearTimeout(requestEvent);
	colors = {
		corporation: "#FFFFFF",
		insurgents: "#000000"
	};
}

//Start playing a game
function playGame(newGame) {

    if (typeof dominiumGame !== 'undefined') {
		clearTimeout(requestEvent);
        clearAnimationState();
        stopFollowing();
        clearMarkers();
    }

	if(newGame.isGameOver){
		currentGameState = 0;
	}
	else{
		currentGameState = newGame.gameState.length-1;
	}

    dominiumGame = newGame;
    initializeGame();

    removeWinner();
    processGameStates();
}
