import classes from "../../components/user/UserData.module.css"
import Button from "../UI/Button";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../store/AuthContext";
import avatar from "../../assets/ava.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import CreationDate from "../feed/CreationDate";
import Modal from "../windowModal/Modal"

const UserData = ({data, refresh}) => {
    const [dataUpdate, setDataUpdate] = useState(data);
    //Pour modifier les données sur la page.
    const [modification, setModification] = useState(false)
    const [imageAdded, setImageAdded] = useState(false);
    const [postNewFile, setPostNewFile] = useState(false);
    const [onConfirm, setOnConfirm] = useState(false)
    const [file, setFile] = useState()
    
    const authCtx = useContext(AuthContext);
    
    //Useref pour stocker les valeurs des inputs. 
    const nomValue = useRef();
    const prenomValue = useRef();

    useEffect(() => {
        setDataUpdate(data)
    }, [data])
    
    //Fonction pour faire passer à true ou false. 
    const modificationHandler = () => {
        setModification((modification) => !modification)
    }

    //Pour afficher l'image selectionné.Création d'une url provisoire "blob".
    const binaryData = [];
    binaryData.push(file);
    const imgUrl = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))

    //Fonction pour récupérer les valeurs stockées dans useref.
    const changeInput = (e) => {
        const newNomValue = nomValue.current.value;
        const newPrenomValue = prenomValue.current.value;

        //Pour éviter les problèmes de "Null".
        let newPhoto;
        if(e.target.files && e.target.files.length === 1){
            newPhoto = e.target.files[0]
            setImageAdded(true)
            setFile(newPhoto);
            setPostNewFile(true);
        }

        //Mettre à jour le state. Copie des données puis clés à modifier dans cette liste de données.
        setDataUpdate({
             ...dataUpdate,
            "lastname" : newNomValue,
            "firstname" : newPrenomValue,
        })

        //Création d'une nouvelle variable qui ne passe pas par le state pour éviter des
        //décalages entre ce qu'on écrit et la mise à jour. 
        const dataUpdateInput = {
            "lastname" : newNomValue,
            "firstname" : newPrenomValue,
        }

        //Mettre à jour l'image en utilisant les "bodyraw" de postman à savoir "image" et "ficheUser" dans mon cas.
        //JSON.stringify(dataUpdate) pour éviter l'erreur "object object" du backend.
        //Pour voir en tout cas dans le console log on utilise le .get : console.log(formData.get("image")) etc.
        const formData = new FormData();
        formData.append("image", newPhoto)
        formData.append("ficheUser", JSON.stringify(dataUpdateInput))
        
        const urlPut = `http://localhost:3000/api/fiche_user/${data.id}?userId=${authCtx.userId}`
        const fetchHandler = async () => {
            try{
                const response = await fetch(urlPut, {
                    method: "PUT",
                    headers: {
                        //Le content-type génère des erreurs.
                        Authorization : `Bearer ${authCtx.token}`,
                    },
                    body : formData
                })

                const dataResponse = await response.json();

                if(response.ok){
                }else{
                    throw new Error(dataResponse.error)
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchHandler()
    }

    const urlDelete = `http://localhost:3000/api/authentification/delete?userId=${authCtx.userId}`
    const deleteAccount = async () => {
        try{
            const res = await fetch(urlDelete, {
                method: "DELETE",
                headers : {
                    Authorization : `Bearer ${authCtx.token}`,
                }
            })

            const data = await res.json();

            if(res.ok){
                authCtx.logout()
                window.location="/"
                //Pour afficher la fenêtre "modale".
                setOnConfirm(false)

            }else{
                throw new Error (data.error)
            }

        }catch(err){
            console.log(err)
        }
    }

    //Fonction pour afficher "Window modal".
    const windowConfirm = () => {
        setOnConfirm(true)
    }

    //Fonction pour annuler une suppression en cours (Window modal).
    const unDelete = () => {
        setOnConfirm(false)
    }
    
    //Pour afficher les données de GET, on appelle le props dans useEffect. 
    useEffect(() => {
        if(!modification){
            refresh()
        }
    }, [modification, refresh])

    const photoUrl = data && data.photoProfilUrl;
    
    return (
        <>  
            {/* Modal pour confirmer une suppression */}
            { onConfirm &&
                <Modal
                    title = "Confirmation de la suppression"
                    message = "Voulez-vous vraiment supprimer ce compte ?"
                    onConfirm = {deleteAccount}
                    unDelete = {unDelete}
                />
            }
        
            <section className={classes.user}>
                <div className={classes.picBox}>  </div>
                <div className={classes.pic}>
                    <img className={classes.picture} src={photoUrl ? photoUrl : avatar} alt="Avatar"/>
                    
                    {modification && 
                        <>
                            <input 
                                type="file" 
                                name= "post_image"
                                id="post_image"
                                accept=".jpeg,.jpg,.png" 
                                onChange={changeInput}
                                className={classes.container_file}
                            />
                            {/* Pour remplacer le bouton input par une icône image.*/}
                            <div className={classes.container_icon}>
                                <label htmlFor="post_image" className={classes.container_label}>
                                    <FontAwesomeIcon icon={faCamera} color={imageAdded ? "#4abf66" : ""}/>
                                </label>
                                {/* Pour afficher le fichier selectionné avant publication.*/}
                                {file && 
                                    <>
                                        <div className={classes.elementDisplay}>
                                            <img crossOrigin="anonymous" src={postNewFile ? imgUrl : " "} alt="Img de la Publication" className={classes.img_display}/>
                                        </div>
                                    </>
                                }
                            </div>
                        </>
                    }
                </div>
                
                <div className={classes.text}>
                    <div className={classes.textNameOne}>
                        {!modification && <div className={classes.input}>{dataUpdate && dataUpdate.lastname} </div>}
                        {modification && <input className={classes.textAreaOne} type="text" defaultValue ={dataUpdate.lastname}  onChange={changeInput} ref={nomValue}/>}
                    </div>

                    <div className={classes.textNameTwo}>
                        {!modification && <div className={classes.input}>{dataUpdate && dataUpdate.firstname} </div>}
                        {modification && <input className={classes.textAreaTwo} type="text" defaultValue ={dataUpdate.firstname} onChange={changeInput} ref={prenomValue}/>}
                    </div>
                </div>

                
                <div className={classes.button}>
                    <Button onClick={modificationHandler}>
                        {!modification ? "Modifier" : "Envoyer"}
                    </Button>
                    <Button onClick={windowConfirm}>
                        Supprimer
                    </Button>
                </div>

                <div className={classes.date} > 
                    <p>Compte créé</p>
                    <CreationDate post={data.date}/> 
                </div>
            </section>

        </>
    )
}

export default UserData; 