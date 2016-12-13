var map;

var markerList = {};//username: {marker,info}
var capPoint = {};//name: {marker, info}

var game = {
    gamestates: [
        {
            teamA: {
                players: [
                    {
                        username: "a",
                        lat: "-50",
                        lng: "0",
                        energy : 1,
                        role: "Attacker"
                    },
                    {
                        username: "b",
                        lat: "0",
                        lng: "-50",
                        energy : 1,
                        role: "Attacker"
                    }
                ]
            },
            teamB: {
                players: [
                    {
                        username: "c",
                        lat: "50",
                        lng: "0",
                        energy : 1,
                        role: "Defender"
                    },
                    {
                        username: "d",
                        lat: "0",
                        lng: "50",
                        energy : 1,
                        role: "Defender"
                    }
                ]
            },
            capturePoints: [
                {
                    name: "Cap1",
                    lat: "10",
                    lng: "10",
                    energy: 10,
                    teamOwner: "A"
                },
                {
                    name: "Cap2",
                    lat: "30",
                    lng: "-30",
                    energy: 20,
                    teamOwner: "A"
                }
            ]
        },
        {
            teamA: {
                players: [
                    {
                        username: "a",
                        lat: "-10",
                        lng: "0",
                        energy : 2,
                        role: "Attacker"
                    },
                    {
                        username: "b",
                        lat: "0",
                        lng: "-10",
                        energy : 2,
                        role: "Attacker"
                    }
                ]
            },
            teamB: {
                players: [
                    {
                        username: "c",
                        lat: "10",
                        lng: "0",
                        energy : 2,
                        role: "Defender"
                    },
                    {
                        username: "d",
                        lat: "0",
                        lng: "10",
                        energy : 2,
                        role: "Defender"
                    }
                ]
            },
            capturePoints: [
                {
                    name: "Cap1",
                    lat: "10",
                    lng: "10",
                    energy: 15,
                    teamOwner: "A"
                },
                {
                    name: "Cap2",
                    lat: "30",
                    lng: "-30",
                    energy: 25,
                    teamOwner: "A"
                }
            ]
        },
        {
            teamA: {
                players: [
                    {
                        username: "a",
                        lat: "-10",
                        lng: "10",
                        energy : 3,
                        role: "Attacker"
                    },
                    {
                        username: "b",
                        lat: "-10",
                        lng: "-10",
                        energy : 3,
                        role: "Attacker"
                    }
                ]
            },
            teamB: {
                players: [
                    {
                        username: "c",
                        lat: "10",
                        lng: "-10",
                        energy : 3,
                        role: "Defender"
                    },
                    {
                        username: "d",
                        lat: "10",
                        lng: "10",
                        energy : 3,
                        role: "Defender"
                    }
                ]
            },
            capturePoints: [
                {
                    name: "Cap1",
                    lat: "10",
                    lng: "10",
                    energy: 20,
                    teamOwner: "A"
                },
                {
                    name: "Cap2",
                    lat: "30",
                    lng: "-30",
                    energy: 30,
                    teamOwner: "A"
                }
            ]
        },
        {
            teamA: {
                players: [
                    {
                        username: "a",
                        lat: "-50",
                        lng: "50",
                        energy : 4,
                        role: "Attacker"
                    },
                    {
                        username: "b",
                        lat: "-50",
                        lng: "-50",
                        energy : 4,
                        role: "Attacker"
                    }
                ]
            },
            teamB: {
                players: [
                    {
                        username: "c",
                        lat: "50",
                        lng: "-50",
                        energy : 4,
                        role: "Defender"
                    },
                    {
                        username: "d",
                        lat: "50",
                        lng: "50",
                        energy : 4,
                        role: "Defender"
                    }
                ]
            },
            capturePoints: [
                {
                    name: "Cap1",
                    lat: "10",
                    lng: "10",
                    energy: 25,
                    teamOwner: "A"
                },
                {
                    name: "Cap2",
                    lat: "30",
                    lng: "-30",
                    energy: 35,
                    teamOwner: "B"
                }
            ]
        }
    ]
};

var gameStateDuration = 1000;
var totalDraws = 100;
var timeStep = gameStateDuration / totalDraws;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 1,
        center: new google.maps.LatLng(0,0)
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
    //console.log(markerList);

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

function updateGameState(gamestate) {
    if (Object.keys(markerList).length === 0) {//first gamestate - no movement, just add markers
        initializeGame(gamestate);
        return;
    }
    updateInfos(gamestate);
    gamestate.capturePoints.forEach(function (point) {
       capPoint[point.name].marker.setLabel(point.teamOwner);
    });

    var dataAux = createAuxData(markerList, gamestate);
    setTimeout(function () {
            moveIteration(gamestate, dataAux, 1);
        }, timeStep
    );
}

function moveIteration(gamestate, dataAux, iteration) {
    if (iteration == totalDraws)return;

    getAllPlayers(gamestate).forEach(function (player) {
        moveMarker(
            markerList[player.username].marker,
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
    markerList[player.username] = {
        "marker": new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(player.lat),parseFloat(player.lng)),
            icon: (team === "A") ? "https://maps.gstatic.com/mapfiles/ms2/micons/blue.png":"https://maps.gstatic.com/mapfiles/ms2/micons/red.png",
            optimized: false,
            map: map
        }),
        "info": new google.maps.InfoWindow()
    };

    google.maps.event.addListener(markerList[player.username].marker, 'click', function() {
        markerList[player.username].info.open(map,this);
    });
}
function createCapturePointMarker(point){
    capPoint[point.name] = {
        "marker": new google.maps.Marker({
            position: new google.maps.LatLng(parseFloat(point.lat),parseFloat(point.lng)),
            label: point.teamOwner,
            icon: new google.maps.MarkerImage("capPoint.svg",null,null,null,new google.maps.Size(30, 30)),
            zIndex: -1,
            map: map
        }),
        "info": new google.maps.InfoWindow()
    };

    google.maps.event.addListener(capPoint[point.name].marker, 'click', function() {
        capPoint[point.name].info.open(map,this);
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
    markerList[player.username].info.setContent(
        '<div>'+
        '<b>'+player.username+' ['+player.role+']</b><br/>'+
        'Energy: '+player.energy+
        '</div>'
    );
}
function updateCapturePointInfo(point){
    capPoint[point.name].info.setContent(
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

var gsIndex = 0;
function aux() {
    if(gsIndex == game.gamestates.length) gsIndex = 0;//loop back to first gamestate
    updateGameState(game.gamestates[gsIndex++]);
}