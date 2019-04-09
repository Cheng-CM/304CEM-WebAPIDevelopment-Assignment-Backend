//import express
var Express = require("express");
var BodyParser = require("body-parser");

//import mongoose
var mongoose = require('mongoose');

//import brypt
var bcrypt = require("bcrypt");
var ObjectId = require("mongodb").ObjectID;

//import models
var User = require('./models/User');
var Item = require('./models/item');

//import file upload
var multer = require('multer');
var fs = require('fs');

var app = Express();

//Set up default mongoose connection
var CONNECTION_URL = "mongodb+srv://readwrite:Ptx3SpNh233SGpj@304cem-assignment-c3cpk.azure.mongodb.net/example?retryWrites=true";

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var upload = multer({
    dest:"./upload",
    rename: function (fieldname, filename) {
        return filename;
    }
});

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

app.post("/Register", function (request, response) {
    if (request.body.email &&
        request.body.username &&
        request.body.password &&
        request.body.passwordConf &&
        request.body.password == request.body.passwordConf
    ) {
        User.findOne({
            email: request.body.email
        })
            .exec(function (err, user) {
                if (err) {
                    response.send(err);
                } else if (!user) {
                    bcrypt.hash(request.body.password, 10, function (err, hash) {
                        if (err) return response.send(err);
                        request.body.password = hash;
                        request.body.created = Date.now();
                        new User(request.body).save(function (err) {
                            if (err) return response.send(err);
                            // saved!
                            response.send("Successful");
                        });
                    });
                } else {
                    response.send("Email existed.");
                }
            });


    } else {
        response.send("Invaild Information.");
    }
});

app.post("/Login", function (request, response) {
    if (request.body.email &&
        request.body.password
    ) {
        User.findOne({
            email: request.body.email
        })
            .exec(function (err, user) {
                if (err) {
                    response.send(err);
                } else if (!user) {
                    err = new Error('User not found.');
                    err.status = 401;
                    response.send(err);
                } else {
                    bcrypt.compare(request.body.password, user.password, function (err, result) {
                        if (result === true) {
                            response.send("Successful");
                        } else {
                            response.send("Wrong Password");
                        }
                    });
                }
            });
    } else {
        response.send(400, "Invaild Information.");
    }
});

app.get("/UserById/:id", function (request, response) {
    User.findOne({
        _id: new ObjectId(request.params.id)
    })
        .exec(function (err, user) {
            if (err) {
                response.send(err);
            } else if (!user) {
                err = new Error('User not found.');
                err.status = 401;
                response.send(err);
            } else {
                user.password = '';
                response.send({
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    created: user.created
                });
            }
        });
});

app.get("/UserByName/:name", function (request, response) {
    User.find({
        username: request.params.name
    }).exec(function (err, user) {
        if (err) {
            response.send(err);
        } else if (!user) {
            err = new Error('User not found.');
            err.status = 401;
            response.send(err);
        } else {
            response.send(user);
        }
    });
});

//Item CRUD
app.post('/Item/Create', upload.single("img"), function (req, res) {
    if (req.body.name &&
        req.body.description &&
        req.body.createdBy &&
        req.file.path
    ) {
        var newItem = new Item();
        newItem.img.data = fs.readFileSync(req.file.path);
        newItem.img.contentType = 'image/png';
        newItem.createdBy = ObjectId(req.body.createdBy);
        newItem.created = Date.now();
        newItem.name = req.body.name;
        newItem.description = req.body.description;
        newItem.save();
        res.status(200).send("Successful.");
    } else {
        res.status(401).send("Invaild information.");
    }
});

app.get("/ItemById/:id", function (request, response) {
    Item.findOne({
        _id: new ObjectId(request.params.id)
    })
        .exec(function (err, item) {
            if (err) {
                response.send(err);
            } else if (!item) {
                err = new Error('Item not found.');
                response.status(401).send(err);
            } else {
                response.send(item);
            }
        });
});

app.put("/ItemById/:id", upload.single("img"), function (request, response) {
    if (
        request.body.name &&
        request.body.description
    ) {
        Item.updateOne({
            _id: new ObjectId(request.params.id)
        }, { name: request.body.name, description: request.body.description }
        ).exec(function (err, item) {
            if (err) {
                response.send(err);
            } else if (!item) {
                err = new Error('Item not found.');
                response.status(401).send(err);
            } else {
                response.send(item);
            }
        });
    }
});

app.delete("/ItemById/:id", function (request, response) {
    Item.deleteOne({
        _id: new ObjectId(request.params.id)
    })
        .exec(function (err) {
            if (err) {
                response.send(err);
            } else {
                response.send("Successful.");
            }
        });
});

app.listen(3000, function () {
    mongoose.connect(CONNECTION_URL, {
        useNewUrlParser: true
    }, function (error) {
        if (error) {
            throw error;
        } else {
            console.log("http://localhost:3000/");
        }
    });
});