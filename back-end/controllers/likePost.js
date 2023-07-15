//40 creation likefiche user
const Posts = require("../models/Posts");
const Like = require("../models/Like");

exports.createLikePost = (req, res) => {
    //Nouvelle classe avec les valeurs de req.body.
    const likes = new Like({
        userId : req.body.userId,
        idPost : req.body.idPost,
        likes : req.body.like,
        usersLiked : req.body.userId,
    })
    
    //Enregistrer sur la DB.
    likes
    .save()
    .then(() => 
        res.status(201)
        .json({message : "Le like a été créé et sauvegardé",
            contenu : likes
        }))
    .catch((error) => res.status(500).json({error})) 
}


exports.getLikePost = (req, res) => {
    const userIdParamsUrl = req.originalUrl.split("=")[1];
    const idPost = req.params.id;

    Posts
    .find()
    .then((data) => res.status(200).json(data))
    .catch((error)=> res.status(500).json({error}))
}


exports.updateLikePost = async (req, res) => {
    const userIdParamsUrl = req.originalUrl.split("=")[1]
    try{

        await Posts
        .findById({_id : req.params.id})
        .then((objet) => {
    
            if(!objet.usersLiked.includes(req.body.userId) && req.body.like === 1){
                Posts.updateOne(
                    {_id : req.params.id},
                    {
                        $inc: {likes : 1},
                        $push : {usersLiked : req.body.userId}
                    }
                )
                .then(() => res.status(200).json({message : "Vous avez liké ce post."}))
                .catch((error) => res.status(400).json({error}));
            }else if(objet.usersLiked.includes(req.body.userId) && req.body.like === 0){
                Posts
                .updateOne(
                    {_id : req.params.id},
                    {
                        $inc: {likes : -1},
                        $pull : {usersLiked : req.body.userId}
                    }
                )
                .then(() => res.status(200).json({message : "J'aime enlevé."}))
                .catch((error) => res.status(400).json({error}));
            };
        })
        .catch((error) => res.status(500).json({error}))
    }catch (error) {
        res.status(500).json({
            error : error,
        });
    };
}



