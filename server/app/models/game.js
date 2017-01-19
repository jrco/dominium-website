var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CapturePoint = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  lat: String,
  lng: String,
  radius: Number,
  energy: Number,
  teamOwner: String
});

var Player = new Schema({
  _id: Schema.Types.ObjectId,
  username: String,
  lat: String,
  lng: String,
  role: String,
  energy: Number/*,
  skill: {
    name: String,
    cost: Number,
    cooldown: Number
  }*/
});

var GameState = new Schema({
  _id: Schema.Types.ObjectId,
  corporation: {
    players : [Player],
    points : Number
  },
  insurgents: {
    players : [Player],
    points : Number
  },
  timeStamp : Date,
  capturePoints: [CapturePoint]
});

var GameSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name_of_room: String,
  location: String,
  timeGame : Number,
  gameState: [GameState]
});

module.exports = mongoose.model('Game', GameSchema);
