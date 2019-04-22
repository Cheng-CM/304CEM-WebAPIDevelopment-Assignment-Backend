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
router.get("/cookies", UserController.getCookies);
router.delete("/cookies", UserController.destoryCookie);
//Item CRUD
router.get("/Item/Id/:id", ItemController.findById);
router.get("/Item/Created/:id", ItemController.findByCreatedBy);
//Raffle CRUD
router.get("/Raffle/CreatedBy/:id", RaffleController.findCreated);
router.get("/Raffle/Active", RaffleController.findActive);
router.get("/Raffle/All", RaffleController.allRaffle);
router.get("/Raffle/Id/:id", RaffleController.findById);
module.exports = router;