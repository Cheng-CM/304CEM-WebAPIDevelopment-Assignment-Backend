//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: String,
    description: String,
    createdBy: Schema.Types.ObjectId,
    created: { type: Date, default: Date.now() }
});

//Export function to create "User" model class
var User = mongoose.model('Item', ItemSchema);
module.exports = Item;