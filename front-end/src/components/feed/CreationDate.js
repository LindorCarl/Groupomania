//Autre méthode pour afficher la date et l'heure :  
//====> import dateFormat from "dateformat";
//====> import { masks } from "dateformat";

//Pour afficher la date de création de façon dynamique. 
import dayjs from "dayjs";
require("dayjs/locale/fr");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const CreationDate = ({post}) => {

    //Méthode dateformat.
    //===> masks.hammerDate = "dd-mm-yyyy"
    //===> const date = dateFormat(post, "hammerDate");
    //===> masks.hammerTime = "HH:MM"
    //===> const time = dateFormat(post, "hammerTime");
    //===> <p>Posté le {`${date}`} à {`${time}`}</p>

    return (
        <>
            <p>{dayjs(post).locale("fr").fromNow()}</p>
        </>
    );
}

export default CreationDate;