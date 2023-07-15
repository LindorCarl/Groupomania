const dotenv = require("dotenv");
const result = dotenv.config();

const mongoose = require('mongoose')
mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`)
.then (() => console.log("connexion à Mongo réussi"))
.catch((err) => console.log("Connexion à MongoDB échoué", err));

module.exports = mongoose;

    