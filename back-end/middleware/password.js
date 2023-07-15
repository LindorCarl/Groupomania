const passwordValidator = require("password-validator");
const  passwordSchema = new passwordValidator();

//Le schéma que doit respecter le mot de passe.
passwordSchema
.is().min(10)                                    
.is().max(25)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits()                                
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); 

//Vérifier la qualité du password par rapport au schéma. 
module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)) {
        next();
    }else{
        return res
        .status(400)
        .json({error : "Le mot de passe n'est pas assez fort" })
    }
} 