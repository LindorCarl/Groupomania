const bcrypt = require("bcrypt");

const cryptojs = require("crypto-js")

const jwt = require("jsonwebtoken")

const fs = require("fs");


const dotenv = require("dotenv");
const result = dotenv.config();

const {findAndDeleteUser,
findAndDeleteFicheUser} = require("../queries/ficheUsersQueries");


const User = require("../models/User");
const FicheUser = require ("../models/FicheUser")
const Posts = require ("../models/Posts")
const Comment = require ("../models/Comments")


exports.signup = (req, res) => {
    const {firstname, lastname, email, password, userType } = req.body;
    
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();

    bcrypt
    .hash(password, 10) 
    .then((hash) => {
        //Création d'un nouveau schéma avec mail crypté et password hashé.
        const user = new User({
            firstname : firstname,
            lastname : lastname,
            email : emailCryptoJs,
            password : hash,
            userType
        });
        
        user
        .save()
        .then(() => {
            res.status(201).json({
                message : "Inscription validée, redirection vers la page de connexion..."
            })
        
        })
        .catch((error) => {
            if (error.name === "ValidationError") {
              let errors = {};
        
              Object.keys(error.errors).forEach((key) => {
                errors[key] = error.errors[key].message;
              });
        
              return res.status(400).send(errors);
            }
        })
    })

    .catch((error) => res.status(500).json({error}));
};


//Login pour s'authentifier.
exports.login = (req, res, next) => {
    const emailCryptoJs = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();

    User.findOne({email:emailCryptoJs})
    .then((user) => {
        if(!user){
            return res.status(401).json({error : " Nom d'utilisateur ou mot de passe incorrect, veuillez corriger les informations saisies."})
        }
        
    bcrypt
        .compare(req.body.password, user.password)
        .then((controlPassword) => {

            //Si le mdp est incorrect.
            if(!controlPassword){
                return res.status(401).json({error : " Nom d'utilisateur ou mot de passe incorrect, veuillez corriger les informations saisies."})
            }

            res.status(200).json({
                userId : user._id,
                token : jwt.sign( 
                    //Trois arguments.
                    {userId: user._id},
                    `${process.env.JWT_ENV_TOKEN}`,
                    {expiresIn: "12h"} 
                ),
                userType : user.userType,
            })

        })
        .catch((error) => res.status(500).json({error}));
    })
    .catch((error) => res.status(500).json({error}))
};



exports.readDataUser = async (req, res) => {
    const id = req.originalUrl.split("=")[1];

    User
    .findOne({_id : id})
    .then((data)=> {
        res.status(200).json({data})
    })
    .catch((error) => res.status(404).json({error}))
}


exports.deleteAccount =  (req, res) => {
    const id = req.originalUrl.split("=")[1]
    if (id){
        User
        .deleteOne({_id : id})
        .then(() => res.status(200).json({message : "l'utilisateur a été supprimé"}))
        .catch((error) => res.status(400).json({error}))
        
        FicheUser
        .deleteOne({userId : id})
        .then(() => res.status(200))
        .catch((error) => res.status(400).json({error}))   

        Posts
        .deleteMany({userId : id})
        .then(() => res.status(200))
        .catch((error) => res.status(400).json({error})) 

        Comment
        .deleteMany({userId : id})
        .then(() => res.status(200))
        .catch((error) => res.status(400).json({error}))  

    }else{
        console.log(error) 
    }
}