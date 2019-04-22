var itemModel = require('../models/Item');
var raffleModel = require('../models/raffle');
var ObjectId = require("mongodb").ObjectID;
var fs = require('fs');

module.exports = {
    create: function (request, response, next) {

        if (request.body.name &&
            request.body.description &&
            request.body.createdBy &&
            request.body.img
        ) {
            itemModel.create({
                img: request.body.img,
                createdBy: ObjectId(request.body.createdBy),
                created: Date.now(),
                name: request.body.name,
                description: request.body.description
            }, function (err, small) {
                if (err) return handleError(err);
                // saved!
                response.status(200).send("Successful.");
            });
        } else {
            response.status(401).send("Invaild information.");
        }
    },
    findById: function (request, response, next) {
        itemModel.findOne({
                _id: new ObjectId(request.params.id)
            })
            .exec(function (err, item) {
                if (err) {
                    response.send(err);
                } else if (!item) {
                    response.status(404).send('Item not found.');
                } else {
                    response.send(item);
                }
            });
    },
    findByCreatedBy: function (request, response, next) {
        itemModel.find({
                createdBy: new ObjectId(request.params.id)
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
    },
    updateById: function (request, response) {
        if (
            request.body.name &&
            request.body.description &&
            request.body.img
        ) {
            itemModel.updateOne({
                _id: new ObjectId(request.params.id)
            }, {
                name: request.body.name,
                description: request.body.description,
                img: request.body.img
            }).exec(function (err, item) {
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
    },
    deleteById: function (request, response) {
        raffleModel.find({
                item: new ObjectId(request.params.id)
            })
            .exec(function (err, raffle) {
                if (err) {
                    response.send(err);
                } else if (raffle.length <= 0) {
                    itemModel.deleteOne({
                        _id: new ObjectId(request.params.id)
                    }).exec(function (err) {
                        if (err) {
                            response.send(err);
                        } else {
                            response.send("Successful.");
                        }
                    });
                } else {
                    response.send("Delete Raffle first then Item.");
                }
            });

    }
};