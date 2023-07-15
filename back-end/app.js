//Importer express.
const express = require("express");
 
//Enregistrer les requêtes HTTP et les erreurs.
const morgan = require("morgan");

//Importation de mongoDB.
const mongoose = require("./db/db");

//Importation des routes.
const userRoutes = require("./routes/user");
const ficheUserRoutes = require("./routes/ficheUser");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comment");

//Installation de "express".
const app = express ();

//Pour travailler avec les chemins de fichiers.
const path = require("path");

//Le "model FicheUser". 
const FicheUser = require("./models/FicheUser");

//Installation de morgan pour logger les "request" et "response".
app.use(morgan("dev"));

//Pour gérer les problèmes de CORS (cross origin request sharing).
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

//Pour transformer le "body" en "json".
app.use(express.json());

//Les routes d'authentification.
app.use("/api/authentification", userRoutes);
app.use("/api/fiche_user", ficheUserRoutes);
app.use("/api/posts", postRoutes); 
app.use("/api/comments", commentRoutes);

//Pour acceder au fichier "image".
app.use("/images", express.static(path.join(__dirname, "images")));

//Exportation de app.js pour pouvoir y accéder depuis un autre fichier.
module.exports = app; 