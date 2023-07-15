
const FicheUser = require("../models/FicheUser");
const User = require("../models/User")

const {readAllFicheUserQuery,
readOneFicheUserQuery,
findByIdAndDeleteQuery} = require("../queries/ficheUsersQueries");

//Importer le module fs de node.js pour accéder aux fichiers du serveur.
const fs = require("fs");

exports.createFicheUser = (req, res) =>{
    const id = req.originalUrl.split("=")[1];
    const userFicheObjet = JSON.parse(req.body.ficheUser);

    User
    .findOne({_id : id})
    .then((dataUser) => {
        const ficheUser = new FicheUser({
            userId: userFicheObjet.userId, 
            photoProfilUrl: userFicheObjet.photoProfilUrl,
            lastname : dataUser.lastname,
            firstname : dataUser.firstname,
        })
            //Enregistre l'objet dans la BD.
            ficheUser
            .save() 
            .then(() => {
                res.status(201).json({
                    message: "objet enregistré dans la base de donnée",
                    contenu : req.body.ficheUser
                })
            })
            .catch((error) => res.status(400).json({error}))
    })
            
    .catch((error) => res.status(404).json({error}))
}; 

exports.readAllFicheUser = async (req, res) => {
    try{
        const ficheUser = await readAllFicheUserQuery("-__v");
        res.status(200).json(ficheUser);

    }catch(err){
        res.status(500).json({error : err});
    }
}

exports.readOneFicheUser = async (req, res) => {
    const id = req.originalUrl.split("=")[1];

    FicheUser
    .findOne({userId : id})
    .then((data)=> {
        res.status(200).json({data})
    })
    .catch((error) => res.status(404).json({error}))
}

 
exports.updateOneFicheUser = (req, res, next) => {
    FicheUser
    .findOne({ _id : req.params.id})
    .then((objet) => {
        
        if(userIdParamsUrl === objet.userId){
            if(req.file){
                FicheUser
                .findOne({ _id : req.params.id})
                .then((objet) => {
                    //Récupération du nom de la photo à supprimer dans bd.
                    const filename = objet.photoProfilUrl.split("/images")[1];
                    fs.unlink(`images/${filename}`, (error) => {
                        if(error){
                            console.log(error)
                        }
                    })
                             
                })
                .catch((error) => res.status(404).json({error}))
            }else{
                console.log("false")
            }

            
            const ficheUserObject = req.file ?
            {
                ...JSON.parse(req.body.ficheUser),
                photoProfilUrl:`${req.protocol}://${req.get("host")}/images/${req.file.filename}`
            } : {
                ...JSON.parse(req.body.ficheUser)
            }

    
            FicheUser
            .updateOne({_id : req.params.id}, {...ficheUserObject, _id : req.params.id})
            .then(() => res.status(200).json({
                message : "Profil mis à jour",
                contenu : ficheUserObject}))
            .catch((error) => res.status(404).json({error}))
        }else{
            throw "userId different de userId object à modifier"
    }})
    .catch((error) => res.status(403).json({error}))
}


exports.deleteOneFicheUser = async (req, res) => {
    
    try{
        const id = req.params.id
        const objet = await readOneFicheUserQuery(id);
        userIdParamsUrl = req.originalUrl.split("=")[1];
        
        if(userIdParamsUrl === objet.userId){
            const filename = objet.photoProfilUrl.split("/images")[1];
            fs.unlink(`images/${filename}`, (err) => {
                if(err) res.status(500).json({err});
                console.log(`${filename} le fichier a été supprimé`);
            });

            //Suppression du document dans la base de données.
            const ficheUser = await findByIdAndDeleteQuery(id);
                res.status(200)
                .json({message : `id: ${req.params.id} document supprimé`})
        } else {
            res
            .status(403)
            .json({ message : "utilisateur pas autorisé à supprimer ce document"}); 
        }
    } catch (error) {
        res.status(500).json({
            error : error,
            message : "image inexistante",
        });
    };
}