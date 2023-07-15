
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//Exporter la fonction du middleware.
module.exports = (req, res, next) => {
    try{
        //Récupérer le token dans le headers "authorization : bearer token".
        const token = req.headers.authorization.split(" ")[1]; 

        //Décoder le token.
        const decodedToken = jwt.verify(token, `${process.env.JWT_ENV_TOKEN}`);
        
        //Récupérer le userId à l'interieur du token déchiffré et le comparer à user.
        const userIdDecodedToken = decodedToken.userId

        userIdParamsUrl = req.originalUrl.split("=")[1];

        //Comparaison du userID qu'il y a en clair dans le "req".
        if(req._body === true){
            if(req.body.userId === userIdDecodedToken){
                next();
            }else{
                throw "Erreur authentification userId"
            }
        }else if(userIdParamsUrl === userIdDecodedToken){
            next();
        }else{
            throw "Erreur authentification url params form data" 
        }
    }catch(error){
        res.status(401).json({
            message : "Echec Authentification",
            error : error 
        });
    }
};

