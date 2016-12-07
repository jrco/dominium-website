// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/database'); // connect to our database


var Game = require('./models/games');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8082;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'Welcome to Dominium API' });   
});

// more routes for our API will happen here
router.use(function(req, res, next) {
    // do logging
    //console.log('Request host:');
    //console.log(req.headers.host);
    console.log(req.originalUrl);
    next(); // make sure we go to the next routes and don't stop here
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

// ----------------------------------------------------
router.route('/games')

.get(function(req, res) {
    Game.find(function(err, games) {
        if (err)
            return res.send(err);
        res.json(games);
    });
}) 
// create a News_Parsed (accessed at POST http://localhost:8080/api/news_parsed)

.post(function(req, res) {

    var game = new Game(); // create a new instance of the Game model
    //console.log(req.body.name_of_room);
    //console.log(req.body.location);

    game._id = new mongoose.Types.ObjectId(req.body._id);
    game.name_of_room = req.body.name_of_room;
    game.location = req.body.location;
    game.timeGame = req.body.timeGame;
    game.gameState = req.body.gameState;

    // save the news_parsed and check for errors
    game.save(function(err) {
        if (err)
            return res.send(err);

        res.json({ _id: game._id });
        //return game._id;
    });

});

router.route('/games/:game_id')

// get the article with that id (accessed at GET http://localhost:8080/api/news_parsed/:news_parsed_id)
.get(function(req, res) {
    Game.findById(req.params.game_id, function(err, game) {
        if (err)
            return res.send(err);
        res.json(game);
    });
});

router.route('/games/:game_id/gamestate')

// get the article with that id (accessed at GET http://localhost:8080/api/news_parsed/:news_parsed_id)
.get(function(req, res) {
    Game.findById(req.params.game_id, function(err, game) {
        if (err)
            return res.send(err);
        res.json(game.gameState);
    });
})

// update the news_parsed with this id (accessed at PUT http://localhost:8080/api/news_parsed/:news_parsed_id)
.post(function(req, res) {

    Game.findById(req.params.game_id, function(err, game) {

        if (err)
            return res.send(err);

        game.gameState.push(req.body);
        
        // save the article
        game.save(function(err) {
            if (err)
                return res.send(err);

            res.json({ message: 'Game updated!' });
        });

    });
});


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);