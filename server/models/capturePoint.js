var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var Capture_PointSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  latitute: String,
  longitude: String,
  energy: Number,
  teamOwner: String
});

module.exports = mongoose.model('Capture_Point', Capture_PointSchema);