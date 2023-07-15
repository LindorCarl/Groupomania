const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    userId : {type: String, required: true},
    nom : {type: String, required: true},
    prenom : {type: String, required: true},
    photoProfilUrl : {type: String},
    message : {type: String},
    photoPost : {type: String},
    likes : {type: Number, default: 0},
    usersLiked : {type: [String]},
},
    {
        timestamps : true
    }
);

//Exportater le module.
module.exports = mongoose.model("posts", postSchema); 

