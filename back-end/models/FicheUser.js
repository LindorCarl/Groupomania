// Importer Mongoose.
const mongoose = require("mongoose"); 
const Schema = mongoose.Schema({
    userId: { type: String, required: true},
    lastname: { type: String},
    firstname : { type: String},
    photoProfilUrl : {type: String},
},
    {
        timestamps : true
    }
);

//Exporter le module.
module.exports = mongoose.model("fiche_user", Schema);