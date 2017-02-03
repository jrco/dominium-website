
function aggregateGameStates(game){
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

	statistics.gamestates = game.gameState.length;
	statistics.corporation.color = game.gameState[0].corporation.color;
	statistics.insurgents.color = game.gameState[0].insurgents.color;
	statistics.corporation.color_name = game.gameState[0].corporation.color_name;
	statistics.insurgents.color_name = game.gameState[0].insurgents.color_name;

	game.gameState.forEach(function(gamestate){
		
		gamestate.corporation.players.forEach(function(player){

			if(typeof statistics.corporation.players[player.username] === 'undefined') {
				statistics.corporation.players[player.username] = {
					lat: [],				
					lng: [],
					energy: []
				}
			}

			statistics.corporation.players[player.username].lat.push(parseFloat(player.lat));
			statistics.corporation.players[player.username].lng.push(parseFloat(player.lng));
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

			statistics.insurgents.players[player.username].lat.push(parseFloat(player.lat));
			statistics.insurgents.players[player.username].lng.push(parseFloat(player.lng));
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

			statistics.capturePoints[point.name].lat.push(parseFloat(point.lat));
			statistics.capturePoints[point.name].lng.push(parseFloat(point.lng));
			statistics.capturePoints[point.name].energy.push(point.energy);
			statistics.capturePoints[point.name].teamOwner.push(point.teamOwner);
		});

		statistics.corporation.points.push(gamestate.corporation.points);
		statistics.insurgents.points.push(gamestate.insurgents.points);
	});

	console.log(statistics);

	createPointControlCharts(statistics);
	createDistanceCharts(statistics);
	createPointsCharts(statistics);
}

function createPointControlCharts(statistics){
	//document.getElementById("canvas_cv").innerHTML += "<div id='pointControl'></div>";
	Object.keys(statistics.capturePoints).forEach(function(pointName){
		var totalCorporation = 0;
		var totalInsurgents = 0;

		statistics.capturePoints[pointName].teamOwner.forEach(function(owner){
			if(owner === "Corporation") totalCorporation++;
			if(owner === "Insurgents") totalInsurgents++;
		});


		var canvasId = pointName+"-canvas";
		//document.getElementById("canvas_cv").innerHTML += "<div><can id='"+canvasId+"'></canvas></div>";
		//document.getElementById("canvas_cv").innerHTML += "<div class="box"><canvas id='"+canvasId+"' style='max-width:200px' height='200px'></canvas></div>";
		document.getElementById("canvas_cv").innerHTML += "<div class='circular_canvas'><canvas id='"+canvasId+"' class='canvas_style'></canvas></div>";
		//document.getElementById("pointControl").innerHTML += "<div><canvas id='"+canvasId+"' style='max-width:200px' height='200px'></canvas></div>";

		var total = totalCorporation+totalInsurgents;
		createChart(canvasId,'pie',
			{
				position: 'bottom',
				labels: [statistics.corporation.color_name + " Team", statistics.insurgents.color_name + " Team"],
				datasets: [{
					data: [
						trimNumber((totalCorporation/total)*100,3), 
						trimNumber((totalInsurgents/total)*100,3)
					],
					backgroundColor: [statistics.corporation.color,statistics.insurgents.color]
				}]
			},
			{
				title: {
				    display: true,
				    text: "Time % Control of "+pointName,
					fontSize: 20
				},
				responsive: true,
				maintainAspectRatio: false
			}
		);
	});
}

function createDistanceCharts(statistics){
	/*document.getElementById("canvas_td").innerHTML += "<div id='distance'></div>";*/

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

	var canvasId = "distanceCanvas";
	//document.getElementById("distance").innerHTML += "<div class='distance_canvas'><canvas id='"+canvasId+"'></canvas></div>";
	document.getElementById("canvas_td").innerHTML += "<canvas id='"+canvasId+"'></canvas>";
	//document.getElementById("canvas_td").innerHTML += "<canvas id='"+canvasId+" class='distance_canvas'></canvas>";

	createChart(canvasId,'bar',
		{
			labels: namesCorp.concat(namesIns),
			datasets: [{
				data: distancesCorp.concat(distancesIns),
				borderWidth: 1,
				backgroundColor: getRepeatedArray(statistics.corporation.color,namesCorp.length).concat(getRepeatedArray(statistics.insurgents.color,namesIns.length)),
			}]
		},
		{
			title: {
			    display: true,
			    text: "Travelled distance",
				fontSize: 25
			},
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Distance (m)"
					},
					ticks: {
                		beginAtZero: true
            		}
				}]
			},
			legend: {
				display: false
			},
			responsive: true,
			maintainAspectRatio: false
		}
	);
}


function createPointsCharts(statistics){

	var canvasId = "pointTimeCanvas";
	document.getElementById("canvas_sc").innerHTML += "<canvas id='"+canvasId+"'></canvas></div>";

	createChart(canvasId,'line',
		{
			labels: getRange(statistics.gamestates),
			datasets: [{
				label: statistics.corporation.color_name + " Team",
				data: statistics.corporation.points,
				borderColor: statistics.corporation.color,
				backgroundColor: statistics.corporation.color,
				fill: false
			},{
				label: statistics.insurgents.color_name + " Team",
				data: statistics.insurgents.points,
				borderColor: statistics.insurgents.color,
				backgroundColor: statistics.insurgents.color,
				fill: false
			}]			
		},
		{
			title: {
			    display: true,
			    text: "Score change over time",
				fontSize: 25
			},
			legend : { position: 'bottom' },
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
			maintainAspectRatio: false,
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

function getRepeatedArray(item,times){
	var array = [];
	for(var i = 0; i<times; i++){
		array.push(item);
	}
	return array;
}

function trimNumber(number,maxSize){
	return parseFloat(number.toFixed(maxSize));
}
