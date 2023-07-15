const Posts = require("../models/Posts");
const Comments = require("../models/Comments");
const FicheUser = require("../models/FicheUser");
const User = require("../models/User")

exports.commentController = (req, res) => {
    const { userId, message, post_id} = req.body;
    
    const image = (req.file) ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : "";

    FicheUser
    .findOne({userId}) 
    .then((data) => { 
        
        //Nouvelle "classe" avec les valeurs de req.body.
        const comments = new Comments({
            userId,
            nom: data.lastname,
            prenom: data.firstname,
            photoProfilUrl: data.photoProfilUrl,
            message,
            photoPost : image,
            post_id,
        })

        //Enregistrer sur la DB.
        comments
        .save()
        .then(() => 
            res.status(201)
            .json({message : "Commentaire ajouté.",
                contenu : comments
            }))
        .catch((error) => res.status(500).json({error})) 
            
        })
    .catch((error) => res.status(500).json({error}))

}

//Pour afficher tous les commentaires. 
exports.getCommentController = (req, res) => {
    const id = req.params.id

    Comments
    .find({post_id : id})
    .then((data) => res.status(200).json(data))
    .catch((error)=> res.status(500).json({error}))
}



//Pour mettre à jour un commentaire.
exports.updateCommentController = (req, res) => {
    const userIdParamsUrl = req.originalUrl.split("=")[1]
    const id = req.params.id

    Comments
    .findById({_id : id})
    .then((object) => {
        //Verifier si userId connecté est autorisé à modifier le post.
        //Comparaison userId du post et userId qui fait la demande (userIdParamsUrl).
        if(object.userId === userIdParamsUrl){ 

            const newComments = req.body

            Comments
            .updateOne({_id : req.params.id}, {...newComments,  _id : req.params.id})
            .then(() => res.status(200).json({
                message : "Commentaire mis à jour.", 
                contenu : newComments}))
            .catch((error) => res.status(404).json({error}))
        }else {
            res
            .status(403)
            .json({ message : "Utilisateur pas autorisé à modifier ce commentaire."}); 
        }
    })
    .catch((error) => res.status(500).json({error}))
}

//Pour effacer un commentaire.
exports.deleteCommentController = (req, res) => {
    
    const userIdParamsUrl = req.originalUrl.split("=")[1]
    const id = req.params.id

    User.findOne({userIdParamsUrl})
    .then((data) => {
        if(data.userType === "Admin" || data.userType === ""){
            Comments
            .findById({_id : id })
            .then((object) => {
                //Verifier si userId connecté est autorisé à supprimer le post.
                //Comparaison userId du post et userId qui fait la demande (userIdParamsUrl)
                if(object){
                    Comments
                    .findByIdAndDelete({_id : id })
                    .then(() => res.status(201).json({message : "Commentaire supprimé."}))
                    .catch((error) => res.status(500).json({error : error}))
                }else {
                    res
                    .status(403)
                    .json({ message : "Utilisateur pas autorisé à supprimer ce commentaire"}); 
                }
            })
            .catch((error) => res.status(500).json({
                error : error,
                message : "Commentaire inexistant."
            }))
        }
    })
    .catch((error) => res.status(500).json({error : error}))
}