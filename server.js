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
var Raffle = require('./models/raffle');

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
    dest: "./upload",
    rename: function (fieldname, filename) {
        return filename;
    }
});

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

//User CRUD
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
    }, { password: 0 })
        .exec(function (err, user) {
            if (err) {
                response.send(err);
            } else if (!user) {
                err = new Error('User not found.');
                err.status = 401;
                response.send(err);
            } else {
                response.send(
                    user
                );
            }
        });
});

app.get("/UserByName/:name", function (request, response) {
    User.find({
        username: request.params.name
    }, { password: 0 }).exec(function (err, user) {
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
app.post('/Item/Create', upload.single("img"), function (request, response) {
    if (request.body.name &&
        request.body.description &&
        request.body.createdBy &&
        request.file.path
    ) {
        var newItem = new Item();
        newItem.img.data = fs.readFileSync(request.file.path);
        newItem.img.contentType = 'image/png';
        newItem.createdBy = ObjectId(request.body.createdBy);
        newItem.created = Date.now();
        newItem.name = request.body.name;
        newItem.description = request.body.description;
        newItem.save();
        response.status(200).send("Successful.");
    } else {
        response.status(401).send("Invaild information.");
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

app.get("/AllItem", function (request, response) {
    Item.find({}, {
        img: 0
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

//Raffle CRUD
app.post('/Raffle/Create', function (request, response) {
    if (request.body.name &&
        request.body.description &&
        request.body.createdBy &&
        request.body.item
    ) {
        var newRaffle = new Raffle();
        newRaffle.name = request.body.name;
        newRaffle.description = request.body.description;
        newRaffle.createdBy = ObjectId(request.body.createdBy);
        newRaffle.item = ObjectId(request.body.createdBy);
        newRaffle.created = Date.now();
        newRaffle.active = true;
        newRaffle.save();
        response.status(200).send("Successful.");
    } else {
        response.status(401).send("Invaild information.");
    }
    // response.send(request.body);
});

app.get("/AllRaffle", function (request, response) {
    Raffle.find()
        .exec(function (err, raffle) {
            if (err) {
                response.send(err);
            } else if (!raffle) {
                err = new Error('raffle not found.');
                response.status(401).send(err);
            } else {
                response.send(raffle);
            }
        });
});

app.get("/RaffleById/:id", function (request, response) {
    Raffle.findOne({
        _id: new ObjectId(request.params.id)
    })
        .exec(function (err, raffle) {
            if (err) {
                response.send(err);
            } else if (!raffle) {
                err = new Error('raffle not found.');
                response.status(401).send(err);
            } else {
                response.send(raffle);
            }
        });
});

app.put("/RaffleEdit/:id", function (request, response) {
    if (
        request.body.name &&
        request.body.description
    ) {
        Raffle.updateOne({
            _id: new ObjectId(request.params.id)
        }, { name: request.body.name, description: request.body.description }
        ).exec(function (err, raffle) {
            if (err) {
                response.send(err);
            } else if (!raffle) {
                err = new Error('raffle not found.');
                response.status(401).send(err);
            } else {
                response.send(raffle);
            }
        });
    }
});

app.put("/RaffleActive/:id", function (request, response) {
    if (
        request.body.active
    ) {
        Raffle.updateOne({
            _id: new ObjectId(request.params.id)
        }, { active: request.body.active }
        ).exec(function (err, raffle) {
            if (err) {
                response.send(err);
            } else if (!raffle) {
                err = new Error('raffle not found.');
                response.status(401).send(err);
            } else {
                response.send(raffle);
            }
        });
    }
});

app.put("/Join/:id", function (request, response) {
    if (
        request.body.user
    ) {
        Raffle.updateOne({
            _id: new ObjectId(request.params.id)
        }, {
            "$push": {
                "joined": ObjectId(request.body.user)

            }
            }
        ).exec(function (err, raffle) {
            if (err) {
                response.send(err);
            } else if (!raffle) {
                err = new Error('raffle not found.');
                response.status(401).send(err);
            } else {
                response.send(raffle);
            }
        });
    }
});

app.delete("/RaffleById/:id", function (request, response) {
    Raffle.deleteOne({
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

//Server
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