var Raffle = require('../models/raffle');
var ObjectId = require("mongodb").ObjectID;

module.exports = {
    create: function (request, response, next) {
        if (request.body.name &&
            request.body.description &&
            request.body.createdBy &&
            request.body.item
        ) {
            var newRaffle = new Raffle();
            newRaffle.name = request.body.name;
            newRaffle.description = request.body.description;
            newRaffle.createdBy = ObjectId(request.body.createdBy);
            newRaffle.item = ObjectId(request.body.item);
            newRaffle.created = Date.now();
            newRaffle.active = true;
            newRaffle.save();
            response.status(201).send("Successful.");
        } else {
            response.status(401).send("Invaild information.");
        }
    },
    allRaffle: function (request, response, next) {
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
    },
    findById: function (request, response, next) {
        Raffle.findOne({
                _id: new ObjectId(request.params.id)
            })
            .exec(function (err, raffle) {
                if (err) {
                    response.send(err);
                } else if (!raffle) {
                    err = new Error('raffle not found.');
                    response.status(404).send(err);
                } else {
                    response.send(raffle);
                }
            });
    },
    findByItem: function (request, response, next) {
        Raffle.find({
                item: new ObjectId(request.params.id)
            })
            .exec(function (err, raffle) {
                if (err) {
                    response.send(err);
                } else if (!raffle) {
                    err = new Error('raffle not found.');
                    response.status(404).send(err);
                } else {
                    response.send(raffle);
                }
            });
    },
    updatebyId: function (request, response, next) {
        if (
            request.body.name &&
            request.body.description &&
            request.body.item
        ) {
            Raffle.updateOne({
                _id: new ObjectId(request.params.id)
            }, {
                name: request.body.name,
                description: request.body.description,
                item: request.body.item

            }).exec(function (err, raffle) {
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
    },
    updateStatus: function (request, response, next) {
        if (
            request.params.active
        ) {
            Raffle.updateOne({
                _id: new ObjectId(request.params.id)
            }, {
                active: request.params.active
            }).exec(function (err, raffle) {
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
    },
    join: function (request, response, next) {
        console.log(request);
        
        if (
            request.params.user
        ) {
            Raffle.updateOne({
                _id: new ObjectId(request.params.id),
                joined: {
                    $ne: request.params.user
                }
            }, {
                "$push": {
                    "joined": request.params.user
                }
            }).exec(function (err, raffle) {
                if (err) {
                    console.log(err);
                } else if (!raffle) {
                    response.status(401).send('raffle not found.');
                } else {
                    response.send(raffle);
                }
            });
        } else {
            response.status(401).send("Invaild information.");
        }
    },
    deletebyId: function (request, response, next) {
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
    },
    findCreated: function (request, response, next) {
        Raffle.find({
                createdBy: new ObjectId(request.params.id)
            })
            .exec(function (err, raffle) {
                if (err) {
                    response.send(err);
                } else if (!raffle) {
                    err = new Error('raffle not found.');
                    response.status(404).send(err);
                } else {
                    if (raffle.length > 0) {
                        response.send(raffle);
                    } else {
                        response.status(404).send('raffle not found.');
                    }
                }
            });
    },
    findJoined: function (request, response) {
        Raffle.find({
                joined: new ObjectId(request.params.id)
            })
            .exec(function (err, raffle) {
                if (err) {
                    console.log(err);
                    response.send(err);
                } else if (!raffle) {
                    response.status(404).send('raffle not found.');
                } else {
                    if (raffle.length > 0) {
                        response.send(raffle);
                    } else {
                        response.status(404).send('raffle not found.');
                    }
                }
            });
    },
    findActive: function (request, response) {
        Raffle.find({
                active: true
            })
            .exec(function (err, raffle) {
                if (err) {
                    console.log(err);
                    response.send(err);
                } else if (!raffle) {
                    response.status(404).send('raffle not found.');
                } else {
                    if (raffle.length > 0) {
                        response.send(raffle);
                    } else {
                        response.status(404).send('raffle not found.');
                    }
                }
            });
    }
};