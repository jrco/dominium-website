var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: String,
  latitute: SchemaTypes.Double,
  longitude: SchemaTypes.Double,
  role: String,
  energy: Number
});

module.exports = mongoose.model('PlayerState', PlayerStateSchema);