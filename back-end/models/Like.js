const mongoose = require("mongoose")

const likeSchema = mongoose.Schema({
    userId : {type: String, required: true},
    idPost : {type: String, required: true},
    likes : {type: Number, default: 0},
    dislikes : {type : Number, default: 0},
    usersLiked : {type: [String]},
    usersDisliked : {type: [String]} 
});

//Exporter le module.
module.exports = mongoose.model("likes", likeSchema); 