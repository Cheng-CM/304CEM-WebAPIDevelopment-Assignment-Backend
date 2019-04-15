var express = require('express');
var router = express.Router();

var ItemController = require('../controllers/item');
var RaffleController = require('../controllers/raffle');

var multer = require('multer');
var upload = multer({
    dest: "./upload",
    rename: function (fieldname, filename) {
        return filename;
    }
});
//Item CRUD
router.post('/Item', upload.single("img"), ItemController.create);
router.put("/Item/Id/:id", upload.single("img"), ItemController.updateById);
router.delete("/Item/Id/:id", ItemController.deleteById);
//Raffle CRUD
router.post('/Raffle', RaffleController.create);
router.put("/Raffle/Id/:id", RaffleController.updatebyId);
router.put("/Raffle/Id/:id/status/:active", RaffleController.updateStatus);
router.put("/Join/:id/u/:user", RaffleController.join);
router.delete("/Raffle/Id/:id", RaffleController.deletebyId);
module.exports = router;