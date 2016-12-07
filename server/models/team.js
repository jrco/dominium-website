var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
  _id: Schema.Types.ObjectId,
  players: [{type: Schema.Types.ObjectId, ref: 'Player'}],
  points: Number
});

module.exports = mongoose.model('Team', TeamSchema);