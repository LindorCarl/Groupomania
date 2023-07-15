import React, { useCallback} from 'react';
import { useContext, useEffect,useRef, useState } from "react";
import AuthContext from "../store/AuthContext";
import CreationDate from "./CreationDate";
import classes from "../feed/Comment.module.css";
import Button from "../UI/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faComment} from "@fortawesome/free-solid-svg-icons";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import PostLikeTest from "./PostLike";
import ProfilePicture from './ProfilePicture';
//Pour afficher les liens et les rendre cliquable. 
import Linkify from 'linkify-react';
import avatar from "../../assets/ava.png";
import Modal from '../windowModal/Modal';


const Comment = ({dataPost}) => {
    const [message, setMessage] = useState("");
    const [posts, setPosts] = useState(null);
    const [displayComment, setDisplayComment] = useState(null);
    const [showComment, setShowComment] = useState(false);
    const [isShown, setIsShown] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [idHovering, setIdHovering] = useState(false);
    const [modification, setModification] = useState(false);
    const [messageTextArea, setMessageTextArea] = useState(null);
    const [updatingFinish, setUpdatingFinish] = useState(false);
    const [display, setDisplay] = useState(false)
    const [onConfirm, setOnConfirm] = useState(false)
    const infosDisplay = useRef()

    //Données du store. 
    const authCtx = useContext(AuthContext)
    const admin = localStorage.getItem("admin")
    
    //Id provenant de l'id unique du post.
    const idPost = dataPost._id;
    //Id provenant de l'id unique du commentaire et non de post_id.
    const idComment = authCtx.idFromComment;

    //Données à publier.
    const formData = new FormData();
    formData.append("userId", authCtx.userId);
    formData.append("message", message);
    formData.append("post_id", idPost);
    
    const url = `http://localhost:3000/api/comments?userId=${authCtx.userId}`;
    const commentDisplay = (e) => {
        e.preventDefault();
        const fetchHandler = async () => {
            try{
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        Authorization : `Bearer ${authCtx.token}`,
                    },
                    body : formData
                })
    
                const dataResponse = await response.json();
    
                if(response.ok){
                    //Pour vider le textarea.
                    setMessage("")
                    
                    //Récuperation du contenu à envoyer dans le state.
                    setDisplayComment(message)

                    //Pour afficher et masquer avec "setTimeout" les infos sur les posts et like.
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

    ///////////////////////////////////////////  GET  => Récupérer les commentaires   ////////////////////////////////////////////
    const fetchHandlerGet = useCallback (async () => {
        const urlGet = `http://localhost:3000/api/comments/${idPost}?userId=${authCtx.userId}`
        try{
            const response = await fetch(urlGet, {
                method: "GET",
                headers: {
                    Authorization : `Bearer ${authCtx.token}`,
                }
            })

            const dataResponse = await response.json();
            
            if(response.ok){
                setPosts(dataResponse)
            }else{
                console.log(dataResponse.error)
            }

        }catch(error){
            console.log(error)
        }
    }, [authCtx.token, authCtx.userId, idPost])

    ////////////////////////////////////////////  PUT => Modifier un commentaire  /////////////////////////////////////////////////////
    //Data à mettre dans le body.
    const data = {
        userId : authCtx.userId,
        message : messageTextArea,
    }

    const urlPut = `http://localhost:3000/api/comments/${idComment}?userId=${authCtx.userId}`
    const commentUpdate = (e) => {
        e.preventDefault();

        const fetchHandler = async () => {
            try{
                const response = await fetch(urlPut, {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                        Authorization : `Bearer ${authCtx.token}`,
                    },
                    body: JSON.stringify(data)
                })
    
                const dataResponse = await response.json();
    
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
        fetchHandler()
    }

    //Récupérer l'id du post au clic. 
    const modificationHandler = (event) => {
        authCtx.idComment(event.target.id)
        //Passer à true ou false au clic.
        return setModification((modification) => !modification)
    }

    //Pour mettre à jour la modification du post. Repasser le state setModification à 0 après modification et le 
    //state à "true" ou "false" pour déclencher la route GET en cas de modification.
    const updateFinish = () => {
        setModification(null)
        setUpdatingFinish((prevState) => !prevState)
    };

    const toggle = () => {
        setShowComment((prevState) => !prevState)
    }

    //Ajout du state "displayComment" pour ajouter le "comment" instantanément. 
    //useEffect surveille le moindre changement dans ce state et lance la route GET.
    useEffect(() => {
        fetchHandlerGet()
    }, [displayComment, updatingFinish, fetchHandlerGet])


    //////////////////////////////////////////   DELETE   ////////////////////////////////////////////////////////////////
    const fetchHandlerDelete = async () => {
        const url = `http://localhost:3000/api/comments/${idHovering}?userId=${authCtx.userId}`
        
        try{
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization : `Bearer ${authCtx.token}`,
                }
            })

            const dataResponse = await response.json();
            
            if(response.ok){
                //Appel de la route "get" pour mettre à jour les commentaires aprés suppression.
                //Pour afficher et masquer avec "setTimeout" les infos sur les posts.
                fetchHandlerGet()
                
                //Confirmer la suppression ou publication d'un post ou commentaire.
                setTimeout(function() {setDisplay(false)}, 3000)
                setDisplay(true);
                infosDisplay.current.innerText = dataResponse.message
                
                //Pour afficher la fenêtre modale".
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

    //Fonction pour afficher ou cacher les boutons "update" et "delete".
    //Fonction pour afficher les boutons "update" et "delete".
    const handleclick = (event) => {
        setIsShown(true);
        setIdHovering(event.target.id)
    };

    const hideIcon = () => {
        setIsShown(false);
    }

    const handleMouseOver = (event) => {
        setIsHovering(true);
        setIdHovering(event.target.id)
    };
    
    //Fonction pour gérer la hauteur du textarea lorqu'on ajoute du texte. 
    const textRef = useRef();
    useEffect(() => {
        if (textRef && textRef.current) {
        textRef.current.style.height = "0px";
        const taHeight = textRef.current.scrollHeight;
        textRef.current.style.height = taHeight + "px";
        }
    }, [message]); 

    const textValue = useRef()
    useEffect(() => {
        if (textValue && textValue.current) {
            textValue.current.style.height = "0px";
        const taHeight = textValue.current.scrollHeight;
        textValue.current.style.height = taHeight + "px";
        }
    }, [messageTextArea]); 


    return (
        <>   
            {/* Fenêtre modale pour confirmer une suppression */}
            { onConfirm &&
                <Modal
                    title = "Confirmation de la suppression"
                    message = "Voulez-vous vraiment supprimer ce commentaire ?"
                    onConfirm = {fetchHandlerDelete}
                    unDelete = {unDelete}
                />
            }

            {/* La section LIKE et l'icône commentaire.*/}
            <div className={classes.box_comment_like} >
                <div>
                    <PostLikeTest dataPost={dataPost}/>
                </div>
                
                <div className={classes.commentNumber}>
                    <FontAwesomeIcon onClick={toggle} icon={faComment} className={classes.faComment}/>
                    <p>{posts && posts.length}</p> 
                </div> 
            </div> 

            <div className={classes.line}/>

            {/* Pour afficher les infos sur les posts, commentaires et likes.*/}
            {/* Lorsque display sera à "true" après modification affiche la réponse du serveur sinon cache cette réponse "display = false"*/}
            <div className= {display ? classes.infos : classes.hideInfos} ref={infosDisplay}/>

            {/* La section "affichage des commentaires dans un post".*/}
            {posts && posts.map((comment, i) => 
                <div key={i} onMouseEnter={hideIcon} >
                    <div  className={classes.boxText} >
                        {/* Si l'id du post = id du commentaire alors affiche le commentaire dans le post dans lequel il a été tapé.*/}
                        { idPost === comment.post_id && (
                            <div className={showComment ? classes.hide_boxComment : classes.boxComment}  >
                                <img src={comment.photoProfilUrl ? comment.photoProfilUrl : avatar} alt="Profil" className={classes.profil}/>
                                {/* l'id est lié à "onMouseOver" permettant ainsi d'afficher le contenu en fonction de l'id selectionné.*/}
                                <div className={classes.user} onMouseOver={handleMouseOver} id={comment._id}>
                                    <div className={classes.user_name} >
                                        <p>{comment.nom} {comment.prenom} ·</p>
                                        <span > <CreationDate post={comment.createdAt}/> </span>
                                    </div>
                                    {/* Si modification est à "true" à cause du "clic" alors affiche "rien" dans "comment.message" sinon affiche la valeur de "comment.message".*/}
                                    {modification && idComment === comment._id  ? ( 
                                        " " 
                                        ) : ( 
                                        <Linkify options={{target : "_blank"}} >
                                            <p onMouseOver={handleMouseOver} id={comment._id}  className={classes.user_message}>{comment.message}</p>
                                        </Linkify>
                                    )}   
                                </div>

                                {/* Si admin est présent alors affiche l'icône "delete" sur tous les commentaires.*/}
                                {admin ? ( 
                                    <>
                                        <div className={classes.iconPoints} onMouseLeave={hideIcon}>
                                            {isShown && idHovering === comment._id && (    
                                                <>
                                                    {!modification &&
                                                        <div className={classes.iconAdmin}>
                                                            {/*<i id={comment._id} className="fa-solid fa-pen" onClick={modificationHandler}/>*/}
                                                            <i onClick={windowConfirm} className="fa-solid fa-trash"/>
                                                        </div>  
                                                    }
                                                </>
                                            )}
                                            
                                            {isHovering && idHovering === comment._id &&
                                                <p id={comment._id} onMouseEnter={handleclick} className={classes.points} > ... </p>
                                            }
                                        </div>
                                    </>
                                ) : ( 
                                    <>
                                        {authCtx.userId === comment.userId && ( 
                                            <div className={classes.iconPoints} onMouseLeave={hideIcon}>
                                                {/* Au click (handleclick) le state "isShown" sera à "true" pour montrer les contenus ci-dessous .*/}
                                                {/* Ces composants s'afficheront ensuite en fonction de l'id unique.*/}
                                                {isShown && idHovering === comment._id && (    
                                                    <>
                                                        {!modification &&
                                                            <div className={classes.icon}>
                                                                <i id={comment._id} className="fa-solid fa-pen" onClick={modificationHandler}/>
                                                                <i onClick={windowConfirm} className="fa-solid fa-trash"/>
                                                            </div>  
                                                        }
                                                    </>
                                                )}
                                                
                                                {/* Au passage de la souris (OnmouseOver) le state "isHovering" sera à "true" pour montrer ce contenu et aussi en fonction de l'id.*/}
                                                {/* Une fois ce contenu affiché, au click , apparaitront les contenus ci-dessus.*/}
                                                {isHovering && idHovering === comment._id &&
                                                    <p id={comment._id} onMouseEnter={handleclick} className={classes.points} > ... </p>
                                                }
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                                
                    {/* Pour modifier un post, userId connecté doit être le même que userId présent dans le commentaire.*/}
                    {authCtx.userId === comment.userId && ( 
                        <> 
                            { idComment === comment._id && ( 
                                <>
                                    {/* En cas de modification, affiche un textarea et les boutons "modifier" et "annuler".*/}
                                    {modification && 
                                        <div className={classes.box_textArea}>
                                            <textarea defaultValue={comment.message} 
                                                ref={textValue}
                                                id="message" 
                                                name="message" 
                                                className={classes.textArea} 
                                                onChange={(event) => setMessageTextArea(event.target.value)}
                                            />
                                        </div> 
                                    }
                                    {modification && (
                                        <div className={classes.update}> 
                                            <button className={messageTextArea ? classes.updateButton : classes.disabledButton} 
                                                disabled={!(messageTextArea)} onClick={commentUpdate}
                                            >Modifier</button>
                                            <Button onClick={updateFinish} >Annuler</Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            )} 

            {/* Section pour commenter un post.*/}
            <div className={classes.comment}> 
                <ProfilePicture />
                <textarea 
                    name="comment" 
                    id="comment" 
                    ref={textRef}
                    rows="1"
                    maxLength="5000"
                    placeholder="Ecrivez un commentaire..." 
                    className={classes.textBox}
                    value={message ? message : ""}
                    onChange={(event) => setMessage(event.target.value)}
                />
                
                {!message ? ( 
                    <FontAwesomeIcon icon={faPaperPlane} className={classes.disabled}/>
                ) : ( 
                    <FontAwesomeIcon onClick={commentDisplay} icon={faPaperPlane} className={classes.faPaperPlane}/>
                )}
            </div>
        </>
    )
}

export default Comment;