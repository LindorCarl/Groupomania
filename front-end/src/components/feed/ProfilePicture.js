import { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from '../store/AuthContext';
import classes from "../feed/ProfilePicture.module.css";
import avatar from "../../assets/ava.png";

const ProfilePicture = ()  => {
    const [data, setData] = useState(null)
    const authCtx = useContext(AuthContext)

    //Fonction pour récupérer la photo de profil. 
    const fetchhandlerget = useCallback (  () => { 
        const fetchHandler = async () => {
            const url = `http://localhost:3000/api/fiche_user/fiche/?userId=${authCtx.userId}`
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type" : "application/json",
                        Authorization : `Bearer ${authCtx.token}`, 
                    },
                })

                const dataResponse = await response.json();

                if(response.ok){
                    setData(dataResponse);
                }else{
                    console.log(dataResponse.error)
                }
            }catch(error){
                console.log(error)
            }   
        } 
        fetchHandler()
    }, [authCtx.token, authCtx.userId] )    

    //Fonction Pour aller chercher les données dans la DB.
    useEffect(() => {
        fetchhandlerget()
    }, [fetchhandlerget])

    return (
        <>
            <img src={data && data.data.photoProfilUrl ? data.data.photoProfilUrl : avatar} alt="Profil" className={classes.profile_picture}/>
        </>
    );
}

export default ProfilePicture;