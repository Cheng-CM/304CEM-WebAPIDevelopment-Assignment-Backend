//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    created: { type: Date, default: Date.now() }
});

//Export function to create "User" model class
var User = mongoose.model('User', UserSchema);
module.exports = User;