// server.js

// BASE SETUP
// =============================================================================

// set up =========================
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var mongoose   = require('mongoose');
var morgan     = require('morgan')
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)


//configuration =====================
mongoose.connect('mongodb://localhost:27017/database'); // connect to our database

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


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
//app.use('/', router);

// routes ======================================================================
// api -----------------
// get all games
app.get('/games', function(req, res){
    Game.find(function(err, games) {
        if (err)
            return res.send(err);
        res.json(games);
    });
});

app.post('/games',function(req, res) {

    Game.create({
     _id: new mongoose.Types.ObjectId(req.body._id),
      name_of_room: req.body.name_of_room,
      location: req.body.location,
      timeGame :  req.body.timeGame,
      gameState: req.body.gameState
    }, function(err, games){
        if (err)
            res.send(err);
        
        Games.find(function(err, games) {
            if (err)
                res.send(err)
            res.json(games);
        });
    });
});


app.get('/games/:game_id',function(req, res){
    Game.findById(req.params.game_id, function(err, game) {
        if (err)
            return res.send(err);
        res.json(game);
    });
});

app.get('/games/:game_id/gamestate',function(req, res){
    Game.findById(req.params.game_id, function(err, game) {
        if (err)
            return res.send(err);
        res.json(game.gameState);
    });
});

app.post('/games/:game_id/gamestate',function(req, res){
    Game.findById(req.params.game_id, function(err, game) {
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
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// START THE SERVER
// =============================================================================
app.listen(8082);
console.log('App listening on port ' + port);