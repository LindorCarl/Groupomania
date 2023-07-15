import { createContext, useState } from "react";

const defaultValue = {
    token : "",
    userId : "",
    isLogin : "",
    id : "",
    idFromComment: "",
    idFromLike : "",
    userConnected : false,
    admin : "",
    login : () => {},
    logout : () => {}, 
    idPost : () => {},
    idComment : () => {},
    idLike : () => {},
    adminControl : () => {},
    loginControl : () => {}
}

const AuthContext = createContext(defaultValue);
const tokenLocalStorage = localStorage.getItem("token");
const userLocalStorage = localStorage.getItem("userId");


//Pour accéder à ce "defaultValue" il va falloir créer un provider
//qui va wrapper app.js donc le plus haut composant.
export const AuthContextProvider = (props) => {
    const [token, setToken] = useState(tokenLocalStorage);
    const [userId, setUserId] = useState(userLocalStorage);
    const [isLogin, setIsLogin] = useState(false);
    const [id, setId] = useState(null);
    const [idComment, setIdComment] = useState(null);
    const [idLike, setIdLike] = useState(null);
    const [admin, setAdmin] = useState(false)

    //Pour mettre à jour ce token.
    const loginHandler = (token, userId) => {
        setToken(token)
        setUserId(userId)

        //Mettre la donnée dans le LS.
        localStorage.setItem("token", token)
        localStorage.setItem("userId", userId)
    }

    //Fonction pour se déconnecter. 
    const logoutHandler = (token) => {
        setToken(null)
        setUserId(null)

        //Effacer LS.
        localStorage.clear()
    }

    //Récupérer les "id" du post et comment.
    const idPost = (id) => {
        setId(id)
    }

    const idCommentHandler = (id) => {
        setIdComment(id)
    }

    const idLikeHandler = (id) => {
        setIdLike(id)
    }

    const adminHandler = (value) => {
        setAdmin(value)
        localStorage.setItem("admin", value)
    }

    const loginHandlerUser = (value) => {
        setIsLogin(value)
        localStorage.setItem("login", value)
    }

    //les ! ! pour mettre à false userconnected car null par défaut.
    const userConnected = !!token;

    //Context mettra à jour le "default".
    const contextValue = {
        token : token,
        userId : userId,
        isLogin : isLogin,
        id : id,
        idFromComment : idComment,
        idFromLike : idLike,
        loginUser : userConnected,
        adminUser : admin,
        login : loginHandler,
        logout : logoutHandler,
        idPost : idPost,
        idComment : idCommentHandler,
        idLike : idLikeHandler,
        adminControl : adminHandler,
        loginControl : loginHandlerUser
    }

    return(
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;