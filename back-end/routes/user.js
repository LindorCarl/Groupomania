//Importer "express" pour utiliser sa fonction rooter.
const express = require("express");

const password = require("../middleware/password");
const controleEmail = require("../middleware/controleEmail");

//Importer multer pour la gestion des images.
const multer = require("../middleware/multer")

//Importer le "controller".
const userController = require("../controllers/user");
const authentification = require("../middleware/authentification");

//La fonction "router". 
const router = express.Router();
router.post("/signup", password, controleEmail, userController.signup);
router.post("/login", userController.login);
router.get("/userData", authentification, userController.readDataUser)
router.delete("/delete", authentification, userController.deleteAccount)

module.exports = router; 