//Importer le package HTTp pour avoir les outils pour creer le server.
const http = require("http");

//Importer l'application app.js.
const app = require("./app");

//Importer le package pour utiliser les variables d'environnement.
const dotenv = require("dotenv");
const result = dotenv.config()

//Parametrage du port avec set de express.
app.set("port", process.env.PORT);

//Créer le serveur.
const server = http.createServer(app);

//Le serveur écoute les requêtes sur le port.
server.listen(process.env.PORT)
