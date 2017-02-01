var map;

var playerList = {}; //username: marker
var capList = {}; //name: {marker,circle}

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
    var styledMapTypeNight = new google.maps.StyledMapType(
        [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ], { name: 'Night Map' });

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
        //zoomControl: false,
        //scaleControl: false,
        //scrollwheel: false,
        //disableDoubleClickZoom: true,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'dominium_map', 'night_map']
          }
        //mapTypeId: 'satellite'
    });
    //setWinner(dominiumGame);
    //console.log(dominiumGame);
    map.mapTypes.set('dominium_map', styledMapType);
        map.setMapTypeId('dominium_map');

    map.mapTypes.set('night_map', styledMapTypeNight);
        //map.setMapTypeId('night_map');
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center); 
	});
}


//Initializes the game, creates all markers
function initializeGame() {
    var gamestate = dominiumGame.gameState[0];
    gamestate.corporation.players.forEach(function(player) {
        createPlayerMarker(player, gamestate.corporation.color);
    });
    gamestate.insurgents.players.forEach(function(player) {
        createPlayerMarker(player, gamestate.insurgents.color);
    });

    gamestate.capturePoints.forEach(function(point) {
        createCapturePointMarker(point);
    });


    $('span.corporation_points').text(gamestate.corporation.points);
    $('span.insurgents_points').text(gamestate.insurgents.points);

    updateState();
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

//Processes the next gamestate acording to the currentGamestate var
function processGameStates() {
    removeWinner();
    console.log("Executing " + currentGameState);
    if (currentGameState >= dominiumGame.gameState.length - 1) {
        stopFollowing();
        setWinner(dominiumGame);
        return;
    }

    var gamestate = dominiumGame.gameState[++currentGameState];
    updateState();

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
function createPlayerMarker(player, color) {

    playerList[player.username] = new MarkerWithLabel({
        position: new google.maps.LatLng(parseFloat(player.lat), parseFloat(player.lng)),
        icon: new google.maps.MarkerImage(
            //"/img/player/"+encodeURIComponent(color)+"_"+player.role+".png",
            "/img/player/" + encodeURIComponent(color) + ".png",
            null,
            null,
            new google.maps.Point(markerVars.playerWidth / 2, markerVars.playerHeight),
            new google.maps.Size(markerVars.playerWidth, markerVars.playerHeight)
        ),
        labelContent: "<span class='text_label'>" + player.username + "</span>",
        labelAnchor: new google.maps.Point(0, markerVars.playerLabelOffset),
        labelClass: "map_label",
        optimized: false,
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
        labelContent: "<span class='text_label'>" + point.name + "</span>",
        labelAnchor: new google.maps.Point(0, markerVars.pointLabelOffset),
        labelClass: "map_label",
        zIndex: -1,
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

//Updates the UI/Markers according to the gamestate
function updateState() {
    var gamestate = dominiumGame.gameState[currentGameState];

    gamestate.capturePoints.forEach(function(point) {
        updateCapturePointState(gamestate, point);
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

    document.getElementById(player.username + "-energy").style["opacity"] = player.energy/100;
    document.getElementById(player.username + "-energy").setAttribute("aria-valuenow", player.energy);
    document.getElementById(player.username + "-energy").style["width"] = player.energy + "%";
    document.getElementById(player.username + "-energy").innerHTML = player.energy;
}

//Updates the marker and UI of capture points
function updateCapturePointState(gamestate, point) {

    //Update marker icon
    capList[point.name].marker.setIcon(new google.maps.MarkerImage(
        getCapturePointIcon(gamestate, point.teamOwner),
        null,
        null,
        new google.maps.Point(markerVars.pointWidth / 2, markerVars.pointHeight),
        new google.maps.Size(markerVars.pointWidth, markerVars.pointHeight)
    ));

    //Update circle fill color
    if (point.teamOwner === "Corporation") {
        capList[point.name].circle.setOptions({ fillColor: gamestate.corporation.color });
    } else if (point.teamOwner === "Insurgents") {
        capList[point.name].circle.setOptions({ fillColor: gamestate.insurgents.color });
    } else {
        capList[point.name].circle.setOptions({ fillColor: '#FFFFFF' });
    }


    //document.getElementById(point.name+"-energy").style["background-color"] = getTeamColorHex(point.teamOwner);

    //document.getElementById(point.name+"-owner").innerHTML = point.teamOwner;

    //document.getElementById(point.name+"-energy").setAttribute("aria-valuenow",point.energy);
    //document.getElementById(point.name+"-energy").style["width"] = point.energy+"%";
    //$('#'+point.name+'-energy').parent().find('span.value_now').text(point.energy+"%");

    //Update energy bar
    capList[point.name].marker.set("labelContent", "<span class='text_label'>" + point.name + "</span>" + createCapturePointBar(gamestate, point.teamOwner, point.energy));
}

//Returns all players in a gamestate
function getAllPlayers(gamestate) {
    return gamestate.corporation.players.concat(gamestate.insurgents.players);
}

//Creates the HTML element that represents the energy bar of the capture point marker - used by updateCapturePointState()
function createCapturePointBar(gamestate, team, energy) {
    var corpEnergy = 0;
    var insEnergy = 0;

    if (team === "Corporation") {
        corpEnergy = energy;
    } else if (team === "Insurgents") {
        insEnergy = energy
    }

    return "\
	<table class='energy-progress-bar'>\
		<tr>\
			<td>\
				<div style='width:" + corpEnergy + "%;background-color:" + gamestate.corporation.color + ";'>&nbsp;</div>\
				<span>" + corpEnergy + "</span>\
			</td>\
			<td>\
				<div style='width:" + insEnergy + "%;background-color:" + gamestate.insurgents.color + ";'>&nbsp;</div>\
				<span>" + insEnergy + "</span>\
			</td>\
		</tr>\
	</div>";
}

//Gets the correct cap point icon according to the team
function getCapturePointIcon(gamestate, teamOwner) {
    if (teamOwner === "Corporation") {
        return "/img/point/" + encodeURIComponent(gamestate.corporation.color) + ".png";
    } else if (teamOwner === "Insurgents") {
        return "/img/point/" + encodeURIComponent(gamestate.insurgents.color) + ".png";
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
    var newSpeed = document.getElementById('speed').innerHTML * scale;

    //clamp speed between 1/16 and 16
    newSpeed = Math.max(1 / 16, Math.min(newSpeed, 16));
    document.getElementById('speed').innerHTML = newSpeed;

    var newGameStateDuration = DEFAULT_GAMESTATE_DURATION / newSpeed;

    var now = animationData.pauseTime || (new Date()).getTime();
    var current = (now - (animationData.startTime + animationData.timeOffset)) / currentGameStateDuration;
    animationData.timeOffset = (now - animationData.startTime) - current * newGameStateDuration;

    currentGameStateDuration = newGameStateDuration;
    console.log("Speed changed to:", currentGameStateDuration);
}

//Stops following players
function stopFollowing() {

    var players = document.getElementsByClassName("player_selection");
    for (var i = 0; i < players.length; i++) {
        players[i].style.removeProperty("box-shadow");
    }

    if (typeof followEvent !== 'undefined') {
        google.maps.event.removeListener(followEvent);
        followEvent = undefined;
    }
}

//Follow a player
function followPlayer(player) {
    var selectedPlayer = document.getElementById(player + "_selection");

    if (selectedPlayer.style["box-shadow"] === null || selectedPlayer.style["box-shadow"] === "") {
        stopFollowing();

        var marker = playerList[player];
        if (typeof marker === 'undefined') {
            return;
        }

        selectedPlayer.style["box-shadow"] = "inset 0 0 5px 1px white";

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
        document.getElementById("start-button").click();
    }
}

//Start playing a game
function playGame(newGame) {

    if (typeof dominiumGame !== 'undefined') {
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
