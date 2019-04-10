//Require Mongoose
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//Define a schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    created: { type: Date, default: Date.now() }
});

UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });

//Export function to create "User" model class
var User = mongoose.model('User', UserSchema);
module.exports = User;