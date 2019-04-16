var itemModel = require('../models/Item');
var ObjectId = require("mongodb").ObjectID;
var fs = require('fs');

module.exports = {
    create: function (request, response, next) {
        if (request.body.name &&
            request.body.description &&
            request.body.createdBy &&
            request.file
        ) {
            itemModel.create({
                'img.data': fs.readFileSync(request.file.path),
                'img.contentType': 'image/png',
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
    allItem: function (request, response, next) {
        itemModel.find({}, {
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
    },
    updateById: function (request, response) {
        if (
            request.body.name &&
            request.body.description
        ) {
            itemModel.updateOne({
                _id: new ObjectId(request.params.id)
            }, {
                name: request.body.name,
                description: request.body.description
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
        itemModel.deleteOne({
            _id: new ObjectId(request.params.id)
        }).exec(function (err) {
            if (err) {
                response.send(err);
            } else {
                response.send("Successful.");
            }
        });
    }
};