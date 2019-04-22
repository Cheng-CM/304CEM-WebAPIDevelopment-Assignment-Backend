//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: String,
    description: String,
    createdBy: Schema.Types.ObjectId,
    created: { type: Date, default: Date.now() },
    img: String

});

//Export function to create "Item" model class
var item = mongoose.model('Item', ItemSchema);
module.exports = item;