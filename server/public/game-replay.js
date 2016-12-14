var map;

var playerList = {};//username: {marker,info}
var capList = {};//name: {marker, info}

var gameStateDuration = 10000;
var totalDraws = 1000;
var timeStep = gameStateDuration / totalDraws;

var dominiumGame;
var currentGameState = 0;

function initMap() {
	console.log("LOADING MAP");
    map = new google.maps.Map(document.getElementById('dominium-map'), {
        zoom: 1,
        center: new google.maps.LatLng(0,0),
        disableDefaultUI: true
    });
}

function initializeGame(gamestate) {
    console.log("Initializing markers");

    gamestate.teamA.players.forEach(function(player){
        createPlayerMarker(player,"A");
    });
    gamestate.teamB.players.forEach(function(player){
        createPlayerMarker(player,"B");
    });

    //console.log("MARKERS: ");
    //console.log(playerList);

    gamestate.capturePoints.forEach(function(point){
        createCapturePointMarker(point);
    });

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

    //console.log(dataAux);
    return dataAux;
}

function processGameStates() {
    console.log("Executing "+currentGameState);
    if(dominiumGame.gameState.length <= currentGameState){
        //playGame(game);//loop game
        return;
    }

    var gamestate = dominiumGame.gameState[currentGameState++];

    if (currentGameState === 1) {//first gamestate - no movement, just add markers
        initializeGame(gamestate);
        processGameStates(dominiumGame);
        return;
    }

    updateInfos(gamestate);
    gamestate.capturePoints.forEach(function (point) {
       capList[point.name].marker.setLabel(point.teamOwner);
    });

    var dataAux = createAuxData(playerList, gamestate);
    setTimeout(
        function () {
            moveIteration(gamestate, dataAux, 1);
        }, timeStep
    );
}

function moveIteration(gamestate, dataAux, iteration) {
    if (iteration == totalDraws){
        processGameStates(dominiumGame);
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

    setTimeout(
        function () {
            moveIteration(gamestate, dataAux, iteration + 1);
        }, timeStep
    );
}

function createPlayerMarker(player,team){
    playerList[player.username] = {
        "marker": new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(player.lat),parseFloat(player.lng)),
            icon: (team === "A") ? "https://maps.gstatic.com/mapfiles/ms2/micons/blue.png":"https://maps.gstatic.com/mapfiles/ms2/micons/red.png",
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
            label: point.teamOwner,
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
    gamestate.capturePoints.forEach(function(point){
        updateCapturePointInfo(point);
    });
    getAllPlayers(gamestate).forEach(function (player) {
        updatePlayerInfo(player);
    });
}

function updatePlayerInfo(player){
    playerList[player.username].info.setContent(
        '<div>'+
        '<b>'+player.username+' ['+player.role+']</b><br/>'+
        'Energy: '+player.energy+
        '</div>'
    );
}
function updateCapturePointInfo(point){
    capList[point.name].info.setContent(
        '<div>'+
        '<b>'+point.name+'</b><br/>'+
        'Energy: '+point.energy+'<br/>'+
        'Controlled by: '+point.teamOwner+
        '</div>'
    );
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
    return gamestate.teamA.players.concat(gamestate.teamB.players);
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

function playGame(newGame) {
	console.log(newGame);
    currentGameState = 0;
    clearMarkers();

    dominiumGame = newGame;
    processGameStates();
}
/*
function loadGame(){
    var xhr = new XMLHttpRequest();
    xhr.open("get", "game.json", true);
    xhr.responseType = "json";
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            playGame(xhr.response);
        } else {
            console.log("Error");
        }
    };
    xhr.send();
}
*/
