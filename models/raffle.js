//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    created: { type: Date, default: Date.now() }
});

//Export function to create "User" model class
var User = mongoose.model('User', UserSchema);
module.exports = User;