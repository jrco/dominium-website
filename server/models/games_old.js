var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GamesSchema = new Schema({
  _id: Schema.Types.ObjectId,
  games: [{type: Schema.Types.ObjectId, ref: 'Game'}]
});

module.exports = mongoose.model('Games', GamesSchema);