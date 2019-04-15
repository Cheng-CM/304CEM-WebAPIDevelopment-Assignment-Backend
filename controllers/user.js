var userModel = require('../models/User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var ObjectId = require("mongodb").ObjectID;
module.exports = {
    register: function (request, response, next) {
        if (request.body.email &&
            request.body.username &&
            request.body.password &&
            request.body.passwordConf &&
            request.body.password == request.body.passwordConf
        ) {
            userModel.findOne({
                email: request.body.email
            }).exec(function (err, user) {
                if (err) {
                    response.send(err);
                } else if (!user) {
                    request.body.created = Date.now();
                    new userModel(request.body).save(function (err) {
                        if (err) return console.log(err);
                        response.status(201).send("User Created");
                    });
                } else {
                    response.status(400).send("Email existed.");
                }
            });
        } else {
            response.send("Invaild Information.");
        }
    },
    authenticate: function (request, response, next) {
        if (request.body.email &&
            request.body.password
        ) {
            userModel.findOne({
                email: request.body.email
            }).exec(function (err, userInfo) {
                if (err) {
                    next(err);
                } else {
                    if (bcrypt.compareSync(request.body.password, userInfo.password)) {
                        var token = jwt.sign({
                            id: userInfo._id
                        }, request.app.get('secretKey'), {
                            expiresIn: '1h'
                        });
                        response.json({
                            status: "success",
                            message: "user found.",
                            data: {
                                user: userInfo,
                                token: token
                            }
                        });
                    } else {
                        response.json({
                            status: "error",
                            message: "Invalid email/password.",
                            data: null
                        });
                    }
                }
            });
        } else {
            response.send(400, "Invaild Information.");
        }
    },
    findById: function (request, response, next) {
        userModel.findOne({
                _id: new ObjectId(request.params.id)
            }, {
                password: 0
            })
            .exec(function (err, user) {
                if (err) {
                    response.send(err);
                } else if (!user) {
                    response.status(404).send('User not found.');
                } else {
                    response.send(
                        user
                    );
                }
            });
    },
    findByName: function (request, response, next) {
        userModel.find({
            username: request.params.name
        }, {
            password: 0
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
    }
}