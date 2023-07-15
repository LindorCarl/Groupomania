const mongoose = require("mongoose")

const commentSchema = mongoose.Schema({
    userId : {type: String, required: true},
    nom : {type: String},
    prenom : {type: String},
    photoProfilUrl : {type: String},
    message : {type: String},
    photoPost : {type: String},
    post_id: {type: String},
},
    {
        timestamps : true
    }
);

module.exports = mongoose.model("comments", commentSchema); 