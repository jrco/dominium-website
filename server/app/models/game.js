var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CapturePoint = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  lat: String,
  long: String,
  energy: Number,
  teamOwner: String
});

var Player = new Schema({
  _id: Schema.Types.ObjectId,
  username: String,
  lat: String,
  long: String,
  role: String,
  energy: Number
});

var GameState = new Schema({
  _id: Schema.Types.ObjectId,
  teamA: {
    players : [Player],
    points : Number
  },
  teamB: {
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