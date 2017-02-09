var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SubscriberSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: {type: String, unique: true}
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
