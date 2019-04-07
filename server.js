//import express
var Express = require("express");
var BodyParser = require("body-parser");
//import mongoose
var mongoose = require('mongoose');
//import Models
var User = require('./models/User');
//import brypt
var bcrypt = require("bcrypt");
var ObjectId = require("mongodb").ObjectID;

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

//Set up default mongoose connection
var CONNECTION_URL = "mongodb+srv://readwrite:Ptx3SpNh233SGpj@304cem-assignment-c3cpk.azure.mongodb.net/example?retryWrites=true";

//Get the default connection
var db = mongoose.connection;

app.post("/Register", (request, response) => {
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
                            response.send(200, "Successful");
                        });
                    });
                } else {
                    response.send(403,"Email existed.");
                }
            });


    } else {
        response.send(400,"Invaild Information.");
    }
});

app.get("/User/:id", function (request, response) {
    User.findOne({ _id: new ObjectId(request.params.id) })
        .exec(function (err, user) {
            if (err) {
                response.send(err);
            } else if (!user) {
                err = new Error(404,'User not found.');
                err.status = 401;
                response.send(err);
            } else {
                user.password = '';
                response.send({id: user._id, email: user.email, username: user.username, created: user.created});
            }
        });
});

app.post("/Login", (request, response) => {
    if (request.body.email &&
        request.body.password
    ) {
        User.findOne({ email: request.body.email })
            .exec(function (err, user) {
                if (err) {
                    response.send(err);
                } else if (!user) {
                    err = new Error(404,'User not found.');
                    err.status = 401;
                    response.send(err);
                } else {
                    bcrypt.compare(request.body.password, user.password, function (err, result) {
                        if (result === true) {
                            response.send("Successful");
                        } else {
                            response.send(404,"Wrong Password");
                        }
                    });
                }
            });
    } else {
        response.send(400,"Invaild Information.");
    }
});


//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(3000, () => {
    mongoose.connect(CONNECTION_URL, { useNewUrlParser: true }, (error) => {
        if (error) {
            throw error;
        } else { console.log("http://localhost:3000/"); }
    });
});