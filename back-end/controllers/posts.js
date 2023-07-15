const Posts = require("../models/Posts");
const FicheUser = require("../models/FicheUser");
const User = require("../models/User")
const Comment = require("../models/Comments")
const fs = require("fs");

exports.postController = (req, res) => {
    const {userId, message} = req.body;
    const image = (req.file) ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : "";

    FicheUser
    .findOne({userId}) 
    .then((data) => { 
        
        //Nouvelle classe avec les valeurs de req.body.
            const posts = new Posts({
                userId,
                nom: data.lastname,
                prenom: data.firstname,
                photoProfilUrl: data.photoProfilUrl,
                message,
                photoPost : image,
            })

            //Enregistrer sur la DB.
            posts
            .save()
            .then(() => 
                res.status(201)
                .json({message : "Post publié.",
                    contenu : posts
                }))
            .catch((error) => res.status(500).json({error})) 
        
    })
    .catch((error)=> console.log(error))
}

//Pour afficher tous les posts. 
exports.getPostController = (req, res) => {

    Posts
    .find()
    .then((data) => res.status(200).json(data))
    .catch((error)=> res.status(500).json({error}))
}


//Pour mettre à jour un post.
exports.updatePostController = (req, res) => {
    const userIdParamsUrl = req.originalUrl.split("=")[1]
    const id = req.params.id

    Posts
    .findById({_id : id })
    .then((object) => {
        //Verifier si userId connecté est autorisé à supprimer le post.
        //Comparaison userId du post et userId qui fait la demande (userIdParamsUrl).
        if(object.userId === userIdParamsUrl){ 

            const newPosts = req.body

            Posts
            .updateOne({_id : req.params.id}, {...newPosts,  _id : req.params.id})
            .then(() => res.status(200).json({
                message : "Post mis à jour.", 
                contenu : newPosts}))
            .catch((error) => res.status(404).json({error}))
        }else {
            res
            .status(403)
            .json({ message : "Utilisateur pas autorisé à modifier ce post."}); 
        }
    })
    .catch((error) => res.status(500).json({error}))
}

//Pour effacer un post.
exports.deletePostController = (req, res) => {
    const userIdParamsUrl = req.originalUrl.split("=")[1]
    const id = req.params.id

    User.findOne({userIdParamsUrl})
    .then((data) => {
        if(data.userType === "Admin" || data.userType === ""){
            
            Posts
            .findById({_id : id })
            .then((object) => {
                   
                //Verifier si userId connecté est autorisé à supprimer le post.
                //Comparaison userId du post et userId qui fait la demande (userIdParamsUrl).
                if(object){
                    Posts
                    .findByIdAndDelete({_id : id })
                    .then((dataPost) => {res.status(201).json({message : "Post supprimé."})
                        const filename = dataPost.photoPost.split("/images")[1];
                        fs.unlink(`images/${filename}`, (error) => {
                            if(error){
                                console.log(error)
                            }
                        })
                    })
                    .catch((error) => res.status(500).json({error : error}))
                }else {
                    res
                    .status(403)
                    .json({ message : "Utilisateur pas autorisé à supprimer ce post."}); 
                }
            })
            .catch((error) => res.status(500).json({
                error : error,
                message : "Post inexistant"
            }))

            Comment
            .deleteMany({post_id : id})
            .then(() => res.status(200))
            .catch((error) => res.status(400).json({error}))  
        }
    })
    .catch((error) => res.status(500).json({error : error}))

}