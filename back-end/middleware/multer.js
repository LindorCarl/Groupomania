// Multer est utilisé pour envoyer des requêtes avec envoie de fichiers.
const multer = require("multer");

//Dictionnaire des MIME TYPES.
const MIME_TYPES = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpg",
    "image/gif" : "gif",
    "image/gif" : "png"
};

//La destination du fichier.
const storage = multer.diskStorage({
    //La destination de stockage du fichier.
    destination: (req, file, callback) => {
      callback(null, "images");
    },
    filename: (req, file, callback) => {
        //Supprimer les espaces dans le nom du fichier.
        //Originalname (key npm).split(" ") (pour enlever les espaces).join("_")(sinon joindre un _ à la place de l'espace)
      const name = file.originalname.split(" ").join("_");
      const extension = MIME_TYPES[file.mimetype]
      callback(null, `${name}_${Date.now()}.${extension}`);
    }
})
  
const upload = multer({ storage: storage })

//Exporter multer; "".single" pour envoyer un fichier.
module.exports = multer({storage}).single("image");

