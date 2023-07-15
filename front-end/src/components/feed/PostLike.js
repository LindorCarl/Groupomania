import React, { useCallback} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import classes from "../feed/PostLike.module.css"
import { useContext, useEffect, useState } from "react";
import AuthContext from "../store/AuthContext";

const PostLike = ({dataPost}) => {
    const [nbOfLikes, setNbOfLikes] = useState(0);
    const [postLiked, setPostLiked] = useState(null);
    const [reload, setReload] = useState(null);

    const authCtx = useContext(AuthContext);

    //Id provenant de l'id unique du post.
    const idPost = dataPost._id;

    const dataForm = {
        userId: authCtx.userId,
        idPost: idPost,
        like : nbOfLikes,
    }
    
    const neutralLikeHandler = () => {
        const fetchHandlerPost = async () => {
            const url = `http://localhost:3000/api/posts/like/${idPost}?userId=${authCtx.userId}`
            try{
                const response =  await fetch(url, {
                    method: "POST",
                    headers:{
                        //Ajout de "Accept" pour éviter une erreur lors de la requête et un "req.body" vide.
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        Authorization : `Bearer ${authCtx.token}`
                    },
                    body: JSON.stringify(dataForm)
                })

                const dataResponse = await response.json();

                if(response.ok){
                    setReload((prevState) => !prevState);
                }else{
                    throw new Error(dataResponse.error);
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchHandlerPost()
    } 


    const getLike = useCallback (() => {
        const fetchHandler = async () => {
            const urlGet = `http://localhost:3000/api/posts/like?userId=${authCtx.userId}`
            try{
                const response = await fetch(urlGet, {
                    method: "GET",
                    headers:{
                        'Content-Type': 'application/json',
                        Authorization : `Bearer ${authCtx.token}`
                    }
                })

                const dataResponse = await response.json();

                if(response.ok){
                    setPostLiked(dataResponse)
                    
                }else{
                    throw new Error(dataResponse.error)
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchHandler()
    }, [authCtx.token, authCtx.userId]) 

    const handleLike = () => {
        if (dataPost.usersLiked[0] !== authCtx.userId ) {
            setNbOfLikes(1);
            neutralLikeHandler()
        } else {
            setNbOfLikes(0)
            neutralLikeHandler()
        }
      };


    useEffect(() => {
        getLike()
    }, [reload, getLike])
    

    return (
        <div>

            {postLiked && postLiked.map((post, i) => 
                <div key={i} className={classes.icon}>
                    {idPost === post._id &&
                        <>
                            {post.likes > 0 && post.usersLiked.includes(authCtx.userId) ? (
                                <>
                                    <div className={classes.icon_like}>
                                        <FontAwesomeIcon onClick={handleLike} icon={faThumbsUp} className={classes.like}/>
                                        <p>{post.likes}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={classes.icon_like}>
                                        <FontAwesomeIcon onClick={handleLike} icon={faThumbsUp} className={classes.thumbsUp}/>
                                        <p>{post.likes}</p>
                                    </div>
                                </>
                            )}
                        </>
                    }
                </div>
            )}
        </div>
    );
}

export default PostLike;