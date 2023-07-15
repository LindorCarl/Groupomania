//Importer "model".
const FicheUser = require("../models/FicheUser");
const User = require("../models/User")
const Posts = require("../models/Posts")

exports.readAllFicheUserQuery = (select) => {
   return FicheUser.find({}).select(select)
}

exports.readOneFicheUserQuery = (id) => {
    return FicheUser.findOne({ userId : id}).exec();
}

exports.findByIdAndDeleteQuery = (id) => {
    return FicheUser.findByIdAndDelete({_id : id }).exec();
}

exports.findAndDeleteUser = (id) => {
    return User.findOneAndDelete({ userId : id})
}


