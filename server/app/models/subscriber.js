var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SubscriberSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  email: {type: String, unique: true}
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
