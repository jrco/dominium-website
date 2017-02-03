var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CounterSchema = new Schema({
  _id: Schema.Types.ObjectId,
  index: Number,
  name: String,
  replay: Number,
  gamereplay: Number
});

module.exports = mongoose.model('Counter', CounterSchema);