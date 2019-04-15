var express = require('express');
var router = express.Router();

var UserController = require('../controllers/user');
var ItemController = require('../controllers/item');
var RaffleController = require('../controllers/raffle');

//User CRUD
router.post("/Register", UserController.register);
router.post("/Login", UserController.authenticate);
router.get("/User/Id/:id", UserController.findById);
router.get("/User/Name/:name", UserController.findByName);
//Item CRUD
router.get("/Item/Id/:id", ItemController.findById);
router.get("/Item/All", ItemController.allItem);
//Raffle CRUD
router.get("/Raffle/All", RaffleController.allRaffle);
router.get("/Raffle/Id/:id", RaffleController.findById);
module.exports = router;