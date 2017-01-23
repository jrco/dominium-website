var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SubscriberSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  email: String
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);