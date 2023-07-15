# GROUPOMANIA

Groupomania est un réseau social interne pour les collaborateurs de Groupomania que j’ai développé. Le but de ce projet est de permettre aux employés d’interagir les uns avec les autres en créant des comptes personnels, en publiant des histoires, en pouvant interagir avec des histoires que d’autres partagent et en présence d’un administrateur qui doit être capable de gérer le contenu des utilisateurs.

Le frontend de l’application a été développé avec React, Node.js pour son API et MongoDB pour la base de données.

Pour lancer le projet :

:file_folder: **backend** :
Se rendre dans dossier backend et installer node et toute les dépendances :

<kbd>**cd back-end**</kbd>
<kbd>**npm i express**</kbd>

Ensuite, lancer le serveur : <kbd>**npm start**</kbd>

:file_folder: **frontend** : 
Enfin, pour lancer le Front, ouvrir un nouveau terminal et se rendre dans le dossier front-end

<kbd>**cd front-end/**</kbd>

puis lancer react : <kbd>**npm start**</kbd>

Si vous rencontrez le problème suivant : 
<kbd>**react-scripts' is not recognized as an internal or external command**</kbd>

Il s'agit d'un problème survenu dans votre installation du projet. Dans ce cas, supprimez le dossier "node_modules" puis relancez l'installation de tous les modules du projet. Voici la commande à utiliser pour effectuer ces deux manipulations en une seule fois :

<kbd>**rm -rf node_modules && npm install**</kbd>

