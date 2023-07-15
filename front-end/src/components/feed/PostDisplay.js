import { useCallback, useContext, useEffect, useRef,  useState } from "react";
import AuthContext from "../store/AuthContext";
import classes from "../feed/PostDisplay.module.css";
import Button from "../UI/Button";
import avatar from "../../assets/ava.png";
import CreationDate from "./CreationDate";
import Comment from "./Comment";
import Linkify from 'linkify-react';
import ErrorModal from "../windowModal/Modal"; 
import SessionModal from "../windowModal/SessionModal";

const FeedDisplay = ({onUpdate}) => {
    const[posts, setPosts] = useState(null);
    const[messageTextArea, setMessageTextArea] = useState(null);
    const[updatingFinish, setUpdatingFinish] = useState(false);
    const [isShown, setIsShown] = useState(false);
    const [idHovering, setIdHovering] = useState(false);
    const [display, setDisplay] = useState(false)
    const [onConfirm, setOnConfirm] = useState(false)
    const [confirmAlert, setConfirmAlert] = useState(false)
    const infosDisplay = useRef()

    //Données du store.
    const authCtx = useContext(AuthContext);
    const idPost = authCtx.id;
    const admin = localStorage.getItem("admin")

    //Fonction fetchhandlerget. 
    const fetchHandlerGet = useCallback ( async () => {
        const url = `http://localhost:3000/api/posts?userId=${authCtx.userId}`
        try{
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization : `Bearer ${authCtx.token}`,
                }
            })

            const dataResponse = await response.json();
            
            if(response.ok){
                setPosts(dataResponse)
    
            }else if(dataResponse.error.name){ 
                setConfirmAlert(true)
            }

        }catch(error){
            throw new Error(error)
        }
    }, [authCtx.token, authCtx.userId])

   //Pour aller chercher les données dans la DB.
    useEffect(() => {
        fetchHandlerGet()
    }, [onUpdate, updatingFinish, fetchHandlerGet])
    
    ////////////////////////    "PUT" ===> Modifier un post   //////////////////////////////
    //Section pour mettre à jour.
    const [modification, setModification] = useState(false)
    //Récupérer l'id du post au clic. 
    const modificationHandler = (event) => {
        //Enregistrer l'id dans le store.
        authCtx.idPost(event.target.id)
        //Passer à true ou false au clic.
        return setModification((modification) => !modification)
    }

    //Fonction pour modifier la route "put". 
    const updateHandler = () => {
        //Data à mettre dans le body.
        const data = {
            userId : authCtx.userId,
            message : messageTextArea,
        }

        const url = `http://localhost:3000/api/posts/${idPost}?userId=${authCtx.userId}`
        const fetchHandlerUpdate = async () => {
            try{
                const response = await fetch(url, {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        Authorization : `Bearer ${authCtx.token}`,
                    },
                    body: JSON.stringify(data)
                })
        
                const dataResponse = await response.json()
                
                if(response.ok){
                    updateFinish()
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
        fetchHandlerUpdate()
    }

    ////////////////////////    "DELETE" ===> Effacer un post   ///////////////////
    const fetchHandlerDelete = async () => {
        const url = `http://localhost:3000/api/posts/${idHovering}?userId=${authCtx.userId}`
        try{
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization : `Bearer ${authCtx.token}`,
                }
            })

            const dataResponse = await response.json();
            
            if(response.ok){
                fetchHandlerGet()

                //Confirmer la suppression ou publication d'un post ou commentaire.
                setTimeout(function() {setDisplay(false)}, 3000)
                setDisplay(true);
                infosDisplay.current.innerText = dataResponse.message

                //Pour afficher la fenêtre modale.
                setOnConfirm(false)
            }else{
                console.log(dataResponse.error)
            }
        }catch(error){
            throw new Error(error)
        }
    }

    //Fonction pour afficher la fenêtre modale.
    const windowConfirm = () => {
        setOnConfirm(true)
    }

    //Fonction pour annuler une suppression en cours.
    const unDelete = () => {
        setOnConfirm(false)
    }

    //Pour mettre à jour la modification du post.
    //Repasser le state setModification à 0 après modification et le 
    //state à vrai ou faux pour déclencher la route GET en cas de modification.
    const updateFinish = () => {
        setModification(null)
        setUpdatingFinish((prevState) => !prevState)
    };

    //Fonction pour afficher les boutons "update" et "delete".
    const handleclick = (event) => {
        setIsShown(true);
        setIdHovering(event.target.id)
    };

    const hideIcon = () => {
        setIsShown(false);
    }

    //Fonction pour gérer la hauteur du textarea lorqu'on ajoute du texte. 
    const textRef = useRef();
    useEffect(() => {
        if (textRef && textRef.current) {
        textRef.current.style.height = "0px";
        const taHeight = textRef.current.scrollHeight;
        textRef.current.style.height = taHeight + "px";
        }
    }, [messageTextArea]); 

    const modalAlert = () => {
        setTimeout(() => window.location.assign("/", { replace: true }), 100);
        setConfirmAlert(false)
    }

    return (
        <>
            {/* Pour afficher les infos sur les posts, commentaires et likes.*/}
            {/* Lorsque display sera à "true" après modification affiche la réponse du serveur sinon cache cette réponse "display = false"*/}
            <div className= {display ? classes.infos : classes.hideInfos} ref={infosDisplay}/>

            {/* Fenêtre modale pour confirmer une suppression */}
            { onConfirm &&
                <ErrorModal 
                    title = "Confirmation de la suppression"
                    message = "Voulez-vous vraiment supprimer ce post ?"
                    onConfirm = {fetchHandlerDelete}
                    unDelete = {unDelete}
                />
            }

            {/* Fenêtre modale pour afficher une session expirée */}
            {confirmAlert &&
                <SessionModal
                    title = "Session expirée"
                    message = "Votre session a expiré. Veuillez vous reconnecter."
                    onConfirm = {modalAlert}
                />
            }
            
            <section className={classes.box} onMouseEnter={hideIcon} >
                {posts && posts.map((data, i) => 
                    <div key={i} className={classes.boxPost}>
                        {/* Pour afficher le post et ses données.*/}
                        <div className={classes.boxText} >
                            <div className={classes.flex} >
                                <img src={data.photoProfilUrl ? data.photoProfilUrl : avatar} alt="Profil" className={classes.profil}/>
                                
                                <div className={classes.user}>
                                    <p>{data.nom} {data.prenom}</p>
                                    <CreationDate post={data.createdAt} />
                                </div>
                            </div>
                        
                            {/* Si admin est présent alors affiche l'icône "delete" sur tous les posts.*/}
                            {admin ? ( 
                                <> 
                                    <div className={classes.iconFlex} onMouseLeave={hideIcon} >
                                        {isShown && idHovering === data._id &&(    
                                            <>
                                                {!modification && 
                                                    <>
                                                        <div className={classes.iconAdmin}>
                                                            <i onClick={windowConfirm } className="fa-solid fa-trash"/>
                                                        </div>
                                                    </>
                                                }
                                            </>
                                        )}
                                    
                                        {/* Au passage de la souris (OnmouseOver) le state "isHovering" sera à "true" pour montrer ce contenu et aussi en fonction de l'id.*/}
                                        {/* Une fois ce contenu affiché, au click , apparaitront les contenus ci-dessus.*/}
                                        <div className={classes.border_points}>
                                            <p id={data._id} onMouseEnter={handleclick} className={classes.points}> ... </p>
                                        </div>
                                    </div>
                                </> 
                            ) : ( 
                                <div className={classes.iconFlex} onMouseLeave={hideIcon}>
                                    {authCtx.userId === data.userId && 
                                        <> 
                                            {isShown && idHovering === data._id &&(    
                                                <>
                                                    {!modification && 
                                                        <>
                                                            <div className={classes.icon} id="icon" >
                                                                <i id = {data._id} className="fa-solid fa-pen" onClick={modificationHandler}/>
                                                                <i onClick={windowConfirm } className="fa-solid fa-trash"/>
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                            )}
                                        
                                            {/* Au passage de la souris (OnmouseOver) le state "isHovering" sera à "true" pour montrer ce contenu et aussi en fonction de l'id.*/}
                                            {/* Une fois ce contenu affiché, au click , apparaitront les contenus ci-dessus.*/}
                                            <div className={classes.border_points}>
                                                <p id={data._id} onMouseEnter={handleclick}  className={classes.points}> ... </p>
                                            </div>
                                        </> 
                                    }
                                </div>
                            )}
                        </div>
                        
                        {modification &&  idPost === data._id ? " " :  <Linkify options={{target : "_blank"}} ><p className={classes.msg}>{data.message}</p></Linkify>}
                        
                        {/* Pour modifier un post userId connecté doit être le même que userId présent dans data.*/}
                        {authCtx.userId === data.userId && ( 
                            <>  
                                { idPost === data._id && ( 
                                    <>
                                        {/* En cas de modification, affiche un textarea et les boutons "modifier" et "annuler".*/}
                                        {modification && 
                                            <textarea 
                                                ref = {textRef} 
                                                cols={2}
                                                defaultValue={data.message}  
                                                id="message" 
                                                name="message" 
                                                className={classes.textArea} 
                                                onChange={(event) => setMessageTextArea(event.target.value)}
                                            />
                                        }
                                        {modification && (
                                            <div className={classes.update}> 
                                                <button 
                                                className={messageTextArea ? classes.updateButton : classes.disabledButton} 
                                                    disabled={!(messageTextArea)} onClick={updateHandler}
                                                >Modifier</button>
                                                <Button onClick={updateFinish}>Annuler</Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {data.photoPost && <img src={data.photoPost} alt="" className={classes.img_display}/>}
                        
                        <Comment dataPost={data}/>
                        
                    </div>)
                }
            </section>
        </>
    )
}

export default FeedDisplay; 

