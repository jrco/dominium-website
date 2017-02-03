
// load de game model
var Games = require('./models/game');
var Subscribers = require('./models/subscriber');
var Counters = require('./models/counter');
var mongoose   = require('mongoose'); // mongoose for mongodb
var express    = require('express');        // call express
var app        = express(); // define our app using express
mongoose.Promise = global.Promise;
var path = require("path");
var http = require('http');
var oneValue = 0;

// expose the routes to our app
module.exports = function(app){
	
	// api ==============================================
	app.get('/index', function(req, res){
		res.sendFile(
			path.join(__dirname, '../public', 'main-page/index.html')
		);

		if(oneValue == 0){
			var counter = new Counters();
			counter._id = new mongoose.Types.ObjectId(req.body._id);
			counter.name = "counters",
		    counter.index = 1;
		    counter.replay = 0;
		    counter.gamereplay = 0;
		    
		    counter.save(function(err) {
	        if (err)
	            return res.send(err);;
	    	});
	    	oneValue = 1;

		} else {
			Counters.findOneAndUpdate({name:'counters'},{$inc : {index: 1}},function(err, doc){
		    if(err){
		        console.log("Something wrong when updating data!");
		    }
			//console.log(doc);
			});
		}
	    
		//Counters.findByIdAndUpdate(id, { $inc: { index: 1 }});
	});


	// api ==============================================
	app.get('/api', function(req, res){
		res.json({message: 'Welcome to Dominium API' });
	});


	// get all games
	app.get('/games', function(req, res){
	    Games.find(function(err, games) {
	        if (err)
	            return res.send(err);
	        res.json(games);
	        //path = "";
	        //res.sendFile(path.join(__dirname, '../public', 'all_games.html'));
	    });
	});

	// get all games with only the last gamestate
	app.get('/games-short', function(req, res){
	    Games.find({},{gameState:{$slice:-1}},function(err, games) {
	        if (err)
	            return res.send(err);
	        res.json(games);
	    });

	    //var query = { name: 'counters' };
	    Counters.findOneAndUpdate({name:'counters'},{$inc : {replay: 1}},function(err, doc){
		    if(err){
		        console.log("Something wrong when updating data!");
		    }
			//console.log(doc);
			});

	});

	// create a game to send back all games after creation
	app.post('/games',function(req, res) {

	    var game = new Games(); // create a new instance of the Rss model
	    game._id = new mongoose.Types.ObjectId(req.body._id);
	    game.name_of_room = req.body.name_of_room;
	    game.location = req.body.location;
	    game.timeGame = req.body.timeGame;
	    game.gameState = req.body.gameState;
	    
	     // save the rss and check for errors
	    game.save(function(err) {
	        if (err)
	            return res.send(err);

	        res.json({_id: game._id });
	    });

	    });

	// get a game with selected id
	app.get('/games/:game_id',function(req, res){
	    Games.findById(req.params.game_id, function(err, game) {
	        if (err)
	            return res.send(err);
	        res.json(game);
	    });

		Counters.findOneAndUpdate({name:'counters'},{$inc : {gamereplay: 1}},function(err, doc){
		    if(err){
		        console.log("Something wrong when updating data!");
		    }
			//console.log(doc);
			});

	});

	// get a gamestate from game with selected id
	app.get('/games/:game_id/gamestate',function(req, res){
	    Games.findById(req.params.game_id, function(err, game) {
	        if (err)
	            return res.send(err);
	        res.json(game.gameState);
	    });
	});

	// create a gamestate and to game to send back all gamestates after creation
	app.post('/games/:game_id/gamestate',function(req, res){
	    Games.findById(req.params.game_id, function(err, game) {
	        if (err)
	            return res.send(err);
	        game.gameState.push(req.body);

	        game.save(function(err) {
	            if (err)
	                return res.send(err);

	            res.json({ message: 'Game updated!' });
	        });
	    });
	});

	// get all games
	app.get('/subscribers', function(req, res){
	    Subscribers.find(function(err, subs) {
	        if (err)
	            return res.send(err);
	        res.json(subs);
	        //path = "";
	        //res.sendFile(path.join(__dirname, '../public', 'all_games.html'));
	    });
	});

	app.post('/subscribers',function(req, res) {

	    var sub = new Subscribers(); // create a new instance of the Rss model
	    sub._id = new mongoose.Types.ObjectId(req.body._id);
	    sub.name = req.body.name;
	    sub.email = req.body.email;

	    //console.log(req);
	    //console.log(res);
	    //console.log(sub.name);
	    
	     // save the rss and check for errors
	    sub.save(function(err) {
	        if (err)
	            return res.status(500).send(err);

	        res.json({_id: sub._id });
	    });
	});

	app.get('/counters', function(req,res) {
		 Counters.find(function(err, counters) {
	        if (err)
	            return res.send(err);
	        res.json(counters);
		});
	});

	// application -------------------------------------------------------------
	/*app.get('*', function(req, res) {
	    //res.sendFile('../public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	    //res.sendFile('/Users/rafaeloliveira/Documents/repos/dominium-website/server/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)

		res.sendFile(path.join(__dirname, '../public', 'all_games.html'));
	});*/

}
