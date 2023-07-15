import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import MainHeader from '../Layout/MainHeader';
import AuthContext from '../store/AuthContext';
import UserData from '../user/UserData';
import SessionModal from '../windowModal/SessionModal';
import classes from "../pages/User.module.css";

const User = () => {
    const [data, setData] = useState("");
    const [created, setCreated] = useState(false);
    const [confirmAlert, setConfirmAlert] = useState(false)
    const [display, setDisplay] = useState(false)
    const infosDisplay = useRef()

    //Données du store.
    const authCtx = useContext(AuthContext);
    const login = authCtx.login;
    const isLogin = localStorage.getItem("login")
    setTimeout(() => localStorage.removeItem("login"), 3000);
    
    
    //Mettre le "userId" dans URL.
    const url = `http://localhost:3000/api/fiche_user/fiche/?userId=${authCtx.userId}`
    
    //Pas de "body" dans la requête GET.
    const fetchHandler = useCallback (async () => {
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
                if (dataResponse.data){
                    
                    //Reformatage de la donnée.
                    const newData = () => {
                        return {
                            lastname : dataResponse.data.lastname,
                            firstname : dataResponse.data.firstname,
                            photoProfilUrl :  dataResponse.data.photoProfilUrl,
                            userId : dataResponse.data.userId,
                            id : dataResponse.data._id,
                            date : dataResponse.data.createdAt
                        }
                    }
                    setData(newData);
                    
                    //Pour afficher et masquer avec "setTimeout" les infos sur les posts et like.
                    setTimeout(function() {setDisplay(false)}, 3000)
                    setDisplay(true)
                    infosDisplay.current.innerText = `Bienvenue ${data.firstname}`
                    
                    //True quand y déjà des données(la fiche existe).
                    setCreated(true); 

                //Sinon, créer une fiche vide avec POST s'il n'y a aucune donnée.    
                }else{
                    
                    const createNewFiche = async () => {
                        try{
                            const createObject = {
                                userId : authCtx.userId,
                                photoProfilUrl :  "",
                            }
                            
                            //Format "postman" pour créer la fiche. 
                            const formData = new FormData();
                            formData.append("ficheUser", JSON.stringify(createObject))
                            
                            const urlPost = `http://localhost:3000/api/fiche_user/?userId=${authCtx.userId}`

                            const responseTwo = await fetch(urlPost, {
                                method: "POST",
                                headers: {
                                    //Le "content-type" génère des erreurs.
                                    Authorization : `Bearer ${authCtx.token}`,
                                },
                                body : formData
                            })

                            const dataResponseTwo = await responseTwo.json();

                            if(responseTwo.ok){
                                setCreated(true)
                            }else{
                                console.log(dataResponseTwo.error)
                            }
                        }catch(error){
                            console.log(error)
                        }
                    }
                    createNewFiche()
                }
            }else if(dataResponse.error.name){ 
                setConfirmAlert(true)
            }else{
                throw new Error(dataResponse.error)
            }
        }catch(error){
            console.log(error)
        }
        //Paramètres de useCallback pour éviter les boucles infinies.     
    }, [authCtx.token, url, authCtx.userId, data.firstname])

     
    //Useeffect pour appeler la fonction.
    useEffect(() => {
       if(login){
        fetchHandler()
       }
    }, [fetchHandler,login]); 

    //Pour refresh la page automatiquement après modification en réutilisant la fonction 
    //contenant la méthode GET.
    const refreshData = useCallback ( () =>{
        fetchHandler();
    }, [fetchHandler]);


    //Fenêtre modale pour indiquer une session expirée.
    const modalAlert = () => {
        setTimeout(() => window.location.assign("/", { replace: true }), 100);
        setConfirmAlert(false)
    }


    return (
        <>
            {/* Fenêtre Modale pour afficher une session expirée */}
            {confirmAlert &&
                <SessionModal
                    title = "Session expirée"
                    message = "Votre session a expiré. Veuillez vous reconnecter."
                    onConfirm = {modalAlert}
                />
            }

            {/* Condition pour afficher le texte de bienvenue à chaque connexion. */}
            {isLogin ? ( 
                <div className= {display ? classes.infos : classes.hideInfos} ref={infosDisplay}>
                </div>
                ) : (
                <div className= {classes.hideInfos} ref={infosDisplay} />
            )}
                
            <MainHeader/>
            {login && created &&
                <UserData data={data} refresh={refreshData}/>
            }
        </>
    );
}

export default User;

