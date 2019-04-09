//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var RaffleSchema = new Schema({
    name: String,
    description: String,
    createdBy: Schema.Types.ObjectId,
    created: { type: Date, default: Date.now() },
    item: Schema.Types.ObjectId,
    joined: [Schema.Types.ObjectId],
    active: Boolean
});

//Export function to create "Raffle" model class
var Raffle = mongoose.model('Raffle', RaffleSchema);
module.exports = Raffle;