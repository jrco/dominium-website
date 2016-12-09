
// load de game model
var Games = require('./models/game');
var mongoose   = require('mongoose'); // mongoose for mongodb
var express    = require('express');        // call express
var app        = express(); // define our app using express

// expose the routes to our app
module.exports = function(app){
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
	    });
	});

	// create a game to send back all games after creation
	app.post('/games',function(req, res) {

	    Games.create({
	     _id: new mongoose.Types.ObjectId(req.body._id),
	      name_of_room: req.body.name_of_room,
	      location: req.body.location,
	      timeGame :  req.body.timeGame,
	      gameState: req.body.gameState
	    }, function(err, games){
	        if (err)
	            res.send(err);
	        res.json({_id : '_id'});
	        /*Games.find(function(err, games) {
	            if (err)
	                res.send(err)
	            res.json(games);
	        });*/
	    });
	});

	// get a game with selected id
	app.get('/games/:game_id',function(req, res){
	    Games.findById(req.params.game_id, function(err, game) {
	        if (err)
	            return res.send(err);
	        res.json(game);
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

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
	    res.sendFile('/Users/rafaeloliveira/Documents/repos/dominium-website/server/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
}
