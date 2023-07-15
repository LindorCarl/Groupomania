import {useCallback, useContext,useEffect, useRef, useState } from "react";
import AuthContext from "../store/AuthContext";
import classes from "../feed/Post.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages} from "@fortawesome/free-solid-svg-icons";
import {faXmark} from "@fortawesome/free-solid-svg-icons";


const Feed = ({onUpdate}) => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState()
    const [postNewFile, setPostNewFile] = useState(false);
    const [imageAdded, setImageAdded] = useState(false);
    const [data, setData] = useState([]);
    const [display, setDisplay] = useState(false)
    const infosDisplay = useRef()
    
    //Pour récupérer l'image et éviter les erreurs "undefined et e.target = null"
    const changeImage = (e) => {
        if (e.target.files && e.target.files.length > 0) {
          setFile(e.target.files[0]);
          setPostNewFile(true);
          setImageAdded(true)
        }
    };

    //Pour supprimer le fichier donc passer son "state" à false.
    const emptyFile = (event) => {
        event.preventDefault()
        setFile("")
        setImageAdded(false)
    }

    //Pour afficher l'image selectionnée.Création d'une url provisoire "blob".
    const binaryData = [];
    binaryData.push(file);
    const imgUrl = window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))

    const authCtx = useContext(AuthContext);

    //Les données à envoyer à la BD.
    const formData = new FormData();
    formData.append("userId", authCtx.userId);
    formData.append("message", message);
    formData.append("image", file);
        
    const url = `http://localhost:3000/api/posts?userId=${authCtx.userId}`;
    
    //Envoyer les données avec fetch.
    const submitHandler = async (event) => {
        //Pour ne pas recharger la page.
        event.preventDefault()

        //Fonction pour accéder à la route.
        const fetchHandler = async () => {
            try{
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization : `Bearer ${authCtx.token}`,
                    },
                    body: formData
                })

                const dataResponse = await response.json();
                
                if(response.ok){
                    //Pour vider le textarea.
                    setMessage("")
                    onUpdate(message)

                    //Pour afficher et masquer avec "setTimeout" les infos sur les posts.
                    setTimeout(function() {setDisplay(false)}, 3000)
                    setDisplay(true);
                    infosDisplay.current.innerText = dataResponse.message
                }else{
                    console.log(dataResponse.error)
                }

            }catch(error){
                throw new Error(error)
            }
        }
        fetchHandler()
    }

    /////////////////////////////////////////    GET     //////////////////////////////////////////////
    const fetchHandler = useCallback (async () => {
        const urlGet = `http://localhost:3000/api/fiche_user/fiche/?userId=${authCtx.userId}`
        try {
            const response = await fetch(urlGet, {
                method: "GET",
                headers: {
                    Authorization : `Bearer ${authCtx.token}`, 
                },
            })

            const dataResponse = await response.json();

            if(response.ok){
                setData(dataResponse.data);
            }
            
        }catch(error){
            console.log(error)
        }
        //Paramètres de useCallback pour éviter les boucles.     
    }, [authCtx.token, authCtx.userId])

    //Useeffect pour appeler la fonction.
    useEffect(() => {
        fetchHandler()
    }, [fetchHandler, message, file]); 

    //Fonction pour gérer la hauteur du textarea lorqu'on ajoute du texte. 
    const textRef = useRef();
    useEffect(() => {
        if (textRef && textRef.current) {
        textRef.current.style.height = "55px";
        const taHeight = textRef.current.scrollHeight;
        textRef.current.style.height = taHeight + "px";
        }
    }, [message]); 

    
    return (
        <>
            {/* Pour afficher les infos sur les posts, commentaires et likes.*/}
            {/* Lorsque display sera à "true" après modification affiche la réponse du serveur sinon cache cette réponse "display = false"*/}
            <div className= {display ? classes.infos : classes.hideInfos} ref={infosDisplay}/>

            <form className={classes.form}>
                <label htmlFor="message" className={classes.title}> Créer une publication </label>
                <textarea 
                    className={classes.textarea}
                    id="message" 
                    name="message" 
                    ref={textRef}
                    placeholder= {`Quoi de neuf, ${data.firstname} ?`}
                    value={message ? message : ""}
                    onChange={(event) => setMessage(event.target.value)}
                /> 
                
                <div className={classes.container}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        name="post_image" 
                        id="post_image" 
                        onChange={changeImage}
                        className={classes.container_file}
                    />
                    {/* Pour remplacer le bouton input par une icône image.*/}
                    <div className={classes.container_icon}>
                        <label htmlFor="post_image" className={classes.container_label}>
                            <FontAwesomeIcon icon={faImages} color={imageAdded ? "#4abf66" : ""}/>
                        </label>
                        <div className={classes.image_name}>{file ? file.name : "Images"}</div>
                    </div>

                    {/* Pour afficher le bouton en cas de message.*/}
                    {message ?
                        <button className={classes.buttonPost} onClick={submitHandler} > Publier </button>
                        : 
                        <button disabled={true} className={classes.buttonDisabled}> Publier </button>
                    } 
                </div>

                {/* Pour afficher le fichier selectionné avant publication.*/}
                {file && 
                    <>
                        <div className={classes.elementDisplay}>
                            <img crossOrigin="anonymous" src={postNewFile ? imgUrl : " "} alt="Img de la Publication" className={classes.img_display}/>
                            <FontAwesomeIcon icon={faXmark}  onClick={emptyFile} className={classes.faXmark}/>
                        </div>
                    </>
                }
            </form>
        </>
    )
}

export default Feed;