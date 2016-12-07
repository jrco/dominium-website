var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameStateSchema = new Schema({
  _id: Schema.Types.ObjectId,
  teamA: { type: Schema.Types.ObjectId, ref: 'Team' },
  teamB: { type: Schema.Types.ObjectId, ref: 'Team' },
  timeStamp : Date,
  timeGame : Number,
  capturePoints: {type: Schema.Types.ObjectId, ref: 'CapturePoint'}
});

module.exports = mongoose.model('GameState', GameStateSchema);