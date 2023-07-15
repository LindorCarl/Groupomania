//Importer mongoose unique validator.
const uniqueValidator = require("mongoose-unique-validator");

const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    userType: { type: String}
}
,
    {
        timestamps : true
    }
);

//Securité conseillée pour ne pas enregistrer 2 fois l'email dans BD. 
userSchema.plugin(uniqueValidator, {message: "L'email a déjà été enregistré." });

//Exportation du module. 
module.exports = mongoose.model("user", userSchema); 