const express = require("express");

//Importation du "controller".
const ficheUser = require("../controllers/ficheUser");

//Importer les "middleware" d'authentification pour les routes.
const authentification = require("../middleware/authentification");

//Multer pour la gestion des images.
const multer = require("../middleware/multer")

//La fonction "router".
const router = express.Router();

//Les routes.
router.post("/", authentification, multer, ficheUser.createFicheUser)
router.get("/", authentification, ficheUser.readAllFicheUser)
router.get("/fiche/", authentification, ficheUser.readOneFicheUser);
router.put("/:id", authentification, multer, ficheUser.updateOneFicheUser)
router.delete("/:id", authentification, ficheUser.deleteOneFicheUser)

//Exportation du module.
module.exports = router; 