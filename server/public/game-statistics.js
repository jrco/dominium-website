var statistics = {
	gamestates: 0,
	corporation: {
		players: {},
		points: []
	},
	insurgents: {
		players: {},
		points: []
	},
	capturePoints: {
		
	}
};


function aggregateGameStates(game){

	statistics.gamestates = game.gameState.length;

	game.gameState.forEach(function(gamestate){
		
		gamestate.corporation.players.forEach(function(player){

			if(typeof statistics.corporation.players[player.username] === 'undefined') {
				statistics.corporation.players[player.username] = {
					lat: [],				
					lng: [],
					energy: []
				}
			}

			statistics.corporation.players[player.username].lat.push(player.lat);
			statistics.corporation.players[player.username].lng.push(player.lng);
			statistics.corporation.players[player.username].energy.push(player.energy);
		});
		gamestate.insurgents.players.forEach(function(player){

			if(typeof statistics.insurgents.players[player.username] === 'undefined') {
				statistics.insurgents.players[player.username] = {
					lat: [],				
					lng: [],
					energy: []
				}
			}

			statistics.insurgents.players[player.username].lat.push(player.lat);
			statistics.insurgents.players[player.username].lng.push(player.lng);
			statistics.insurgents.players[player.username].energy.push(player.energy);
		});

		gamestate.capturePoints.forEach(function(point){
			
			if(typeof statistics.capturePoints[point.name] === 'undefined') {
				statistics.capturePoints[point.name] = {
					lat: [],				
					lng: [],
					energy: [],
					teamOwner: []
				}
			}

			statistics.capturePoints[point.name].lat.push(point.lat);
			statistics.capturePoints[point.name].lng.push(point.lng);
			statistics.capturePoints[point.name].energy.push(point.energy);
			statistics.capturePoints[point.name].teamOwner.push(point.teamOwner);
		});

		statistics.corporation.points.push(gamestate.corporation.points);
		statistics.insurgents.points.push(gamestate.insurgents.points);
	});

	console.log(statistics);

	createPointControlCharts();
	createDistanceCharts();
	createPointsCharts();
}

function createPointControlCharts(){
	document.getElementById("charts").innerHTML += "<tr id='pointControl' align='center'></tr>";
	Object.keys(statistics.capturePoints).forEach(function(pointName){
		var totalCorporation = 0;
		var totalInsurgents = 0;

		statistics.capturePoints[pointName].teamOwner.forEach(function(owner){
			if(owner === "Corporation") totalCorporation++;
			if(owner === "Insurgents") totalInsurgents++;
		});


		var canvasId = pointName+"-chart";
		document.getElementById("pointControl").innerHTML += "<td><canvas id='"+canvasId+"' style='max-width:200px' height='200px'></canvas></td>";

		var total = totalCorporation+totalInsurgents;
		createChart(canvasId,'pie',
			{
				labels: ["Corporation", "Insurgents"],
				datasets: [{
					data: [
						(totalCorporation/total).toFixed(3), 
						(totalInsurgents/total).toFixed(3)
					],
					backgroundColor: [getTeamColor("corporation"),getTeamColor("insurgents")]
				}]
			},
			{
				title: {
				    display: true,
				    text: "Time % Control of "+pointName
				},
				responsive: true,
				maintainAspectRatio: false
			}
		);
	});
}

function createDistanceCharts(){
	document.getElementById("charts").innerHTML += "<tr id='distance' align='center'></tr>";

	var namesCorp = [];
	var distancesCorp = [];
	Object.keys(statistics.corporation.players).forEach(function(player){
		namesCorp.push(player);
		distancesCorp.push(
			getDistance(statistics.corporation.players[player])
		);
	});

	var namesIns = [];
	var distancesIns = [];
	Object.keys(statistics.insurgents.players).forEach(function(player){
		namesIns.push(player);
		distancesIns.push(
			getDistance(statistics.insurgents.players[player])
		);
	});

	var canvasId = "distanceChart";
	document.getElementById("distance").innerHTML += "<td><canvas id='"+canvasId+"' style='max-width:200px' height='200px'></canvas></td>";

	createChart(canvasId,'bar',
		{
			labels: namesCorp.concat(namesIns),
			datasets: [{
				data: distancesCorp.concat(distancesIns),
				borderWidth: 1,
				backgroundColor: getRepeatedArray(getTeamColor("corporation"),namesCorp.length).concat(getRepeatedArray(getTeamColor("insurgents"),namesIns.length)),
			}]
		},
		{
			title: {
			    display: true,
			    text: "Travelled distance"
			},
			scales: {
				yAxes: [{
				  scaleLabel: {
					display: true,
					labelString: "Distance (m)"
				  }
				}]
			},
			legend: {
				display: false,
			},
			responsive: true,
			maintainAspectRatio: false
		}
	);
}


function createPointsCharts(){

	document.getElementById("charts").innerHTML += "<tr id='pointTime' align='center'></tr>";

	var canvasId = "pointTimeCanvas";
	document.getElementById("pointTime").innerHTML += "<td><canvas id='"+canvasId+"' style='max-width:200px' height='200px'></canvas></td>";


	createChart(canvasId,'line',
		{
			labels: getRange(statistics.gamestates),
			datasets: [{
				label: "Corporation",
				data: statistics.corporation.points,
				borderColor: getTeamColor("corporation"),
				backgroundColor: getTeamColor("corporation"),
				fill: false
			},{
				label: "Insurgents",
				data: statistics.insurgents.points,
				borderColor: getTeamColor("insurgents"),
				backgroundColor: getTeamColor("insurgents"),
				fill: false
			}]			
		},
		{
			title: {
			    display: true,
			    text: "Score change over time"
			},
			scales: {
				yAxes: [{
				  scaleLabel: {
					display: true,
					labelString: "Points"
				  }
				}],
				xAxes: [{
					display: false
				}]
			},
			elements: {
				point: {
					radius: 0
				}
			},
			responsive: true,
			maintainAspectRatio: false
		}
	);
	
}

function createChart(id,chartType,chartData,chartOptions){
	setTimeout(function(){
		var chart = new Chart(id,{
			type: chartType,
			data: chartData,
			options: chartOptions
		});
	},500);
}

function getDistance(player){
	var dist = 0.0;
	for(var i = 0; i<player.lat.length-1; i++){
		dist += google.maps.geometry.spherical.computeDistanceBetween(
			new google.maps.LatLng(player.lat[i], player.lng[i]),
			new google.maps.LatLng(player.lat[i+1], player.lng[i+1])
		);
	}
	return parseInt(dist,10);
}

function getRange(num){
	var array = [];
	for(var i = 0; i<num; i++){
		array.push(i);
	}
	return array;
}

function getTeamColor(team){
	return team === "corporation" ? "#16a085" : "#e74c3c";
}

function getRepeatedArray(item,times){
	var array = [];
	for(var i = 0; i<times; i++){
		array.push(item);
	}
	return array;
}
