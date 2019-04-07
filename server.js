//import express
var Express = require("express");
var BodyParser = require("body-parser");
//import mongoose
var mongoose = require('mongoose');
//import Models
var User = require('./models/User');
//import brypt
var bcrypt = require("bcrypt");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//Set up default mongoose connection
var CONNECTION_URL = "mongodb+srv://readwrite:Ptx3SpNh233SGpj@304cem-assignment-c3cpk.azure.mongodb.net/example?retryWrites=true";

//Get the default connection
var db = mongoose.connection;

app.post("/CreateUser", (request, response) => {
    if (request.body.email &&
        request.body.username &&
        request.body.password &&
        request.body.passwordConf &&
        request.body.password == request.body.passwordConf
    ) {
        User.findOne({ email: request.body.email })
            .exec(function (err, user) {
                if (err) {
                    response.send(err);
                } else if (!user) {
                    bcrypt.hash(request.body.password, 10, function (err, hash) {
                        if (err) return console.log(err);
                        request.body.password = hash;
                        new User(request.body).save(function (err) {
                            if (err) return response.send(err);
                            // saved!
                            response.send("User saved.");
                        });
                    });
                }else{
                    response.send("email exist.");
                }
            });


    } else {
        response.send("Invaild Info.");
    }
});

app.post("/AuthUser", (request, response) => {
    if (request.body.email &&
        request.body.password
    ) {
        User.findOne({ email: request.body.email })
            .exec(function (err, user) {
                if (err) {
                    response.send(err);
                } else if (!user) {
                    var err = new Error('User not found.');
                    err.status = 401;
                    response.send(err);
                }
                bcrypt.compare(request.body.password, user.password, function (err, result) {
                    if (result === true) {
                        response.send("Passed");
                    } else {
                        response.send("Wrong Password");
                    }
                });
            });
    } else {
        response.send("Invaild Info.");
    }
});


//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(3000, () => {
    mongoose.connect(CONNECTION_URL, { useNewUrlParser: true }, (error) => {
        if (error) {
            throw error;
        }
    });
});