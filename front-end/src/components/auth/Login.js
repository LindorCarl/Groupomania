import { useContext, useRef, useState } from "react";
import classes from "./authForm.module.css";
import Button from "../UI/Button";
import AuthContext from "../store/AuthContext";
import Logo from "../../assets/icon-above-font.png";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {faEye} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    const [display, setDisplay] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [auth, setAuth] = useState(false)
    const [passwordType, setPasswordType] = useState("password");
    const [userLogin, setUserLogin] = useState({
        email: "",
        password: "",
    });

    const [passwordFlag, setPasswordFlag] = useState({
        length: false,
    });

    //Pour récupérer les réferences du formulaire. 
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const refSignupEmailError = useRef();
    const refSignupPasswordError = useRef();
    const infosDisplay = useRef();
    const authDisplay = useRef()

    //Utilisation du context.
    const authCtx = useContext(AuthContext)
    
    //Pour garder les valeurs tapées et les ajouter aux variables susdites.
    const submitHandler = (event) => {
        //Récupérer les valeurs.
        const emailValue = emailInputRef.current.value;
        const passwordValue = passwordInputRef.current.value;

        const url = "http://localhost:3000/api/authentification/login"
        const fetchHandler = async () => {
            try{ 
                const response = await fetch(url, {
                    method : "POST",
                    body : JSON.stringify({
                        email : emailValue,
                        password : passwordValue
                    }),
                    headers : {
                        "Content-Type" : "application/json"
                    }
                })
                
                const dataResponse = await response.json()
                    
                if(response.ok){
                    authCtx.login(dataResponse.token, dataResponse.userId)
                    localStorage.setItem("login", true);
                    
                    setTimeout(() => window.location.assign("/user", { replace: true }), 3000);
                    setConfirm(true)
                    if(dataResponse.userType === "Admin"){
                        authCtx.adminControl(true)
                    }
                    setAuth(true)
                    authDisplay.current.innerText = "Authentification réussie."
                }else{
                    //Pour afficher et masquer avec "setTimeout" les infos sur les posts.
                    setTimeout(function() {setDisplay(false)}, 4000)
                    setDisplay(true)
                    infosDisplay.current.innerText = dataResponse.error
                    document.getElementById("email").style.border="2px solid rgb(211, 47, 47)";
                    document.getElementById("password").style.border="2px solid rgb(211, 47, 47)";
                }
            }catch(err){
                console.log(err)
            }
        }
        fetchHandler()
    }

    const {email, password} = userLogin;

    //Regex pour le contrôle du champ Email.
    const regExEmail = (value) => {
        return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(value)
    } 

    const emailControl = () => {
        if(regExEmail(email)) {
            document.getElementById("email").style.border="2px solid #2ecc71";
            refSignupEmailError.current.innerText = ""
            return true
        }else if(email === "") {
            refSignupEmailError.current.innerText = "Veuillez entrer un email."
            document.getElementById("email").style.border="2px solid rgb(211, 47, 47)";
            return false
        }else{
            refSignupEmailError.current.innerText = "Adresse e-mail non valide."
            document.getElementById("email").style.border="2px solid rgb(211, 47, 47)";
            return false
        }
    }

    // ===> Mot de passe.
    const checkPassword = (password) => {
        const flags = {
            length: false
        };

        if (password && password.length >= 10) {
            flags.length = true;
        }
        setPasswordFlag((prev) => ({ ...prev, ...flags }));;
     
        if (flags.length){ 
            document.getElementById("password").style.border="2px solid #2ecc71";
            refSignupPasswordError.current.innerText = "";
            return true
        }else if(password === ""){ 
            refSignupPasswordError.current.innerText = "Veuillez entrer un mot de passe."
            document.getElementById("password").style.border="2px solid rgb(211, 47, 47)";
            return false
        }else {
            document.getElementById("password").style.border="2px solid rgb(211, 47, 47)";
            refSignupPasswordError.current.innerText = "Le mot de passe doit contenir au minimum 10 caractères."
            return false
        }
    };

    const {length} = passwordFlag;

    const passwordCheck = () => {
        if(length){
            return true
        }else if(password === ""){ 
            refSignupPasswordError.current.innerText = "Veuillez entrer un mot de passe."
            document.getElementById("password").style.border="2px solid rgb(211, 47, 47)";
            return false
        }else{
            document.getElementById("password").style.border="2px solid rgb(211, 47, 47)";
            refSignupPasswordError.current.innerText = "Le mot de passe doit contenir au minimum 10 caractères."
            return false
        }
    }

    // ===> Requête fetch si tout est OK.
    const validity = (e) => { 
        e.preventDefault()
        if((emailControl() && passwordCheck())){
            submitHandler()
        }
    }

    // ===> Password hide and show. 
    const togglePassword =(e)=>{
        e.preventDefault()
        if(passwordType === "password" || passwordType === ""){
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }

    return (
        <>  
            <div className= {display ? classes.loginError : classes.hideInfos} ref={infosDisplay}/>

            <div className= {auth ? classes.authConfirm : ""} ref={authDisplay}/>
            
            <div className={classes.auth}>
                <img src={Logo} alt="Logo" className={classes.logo}/>

                <h2> Connectez-vous </h2>

                <form onSubmit={validity}>
                    {/* Champ Email */}
                    <div className={classes.form}>
                        <div className={classes.control}>
                            <input 
                                type='email' 
                                id='email' 
                                ref={emailInputRef} 
                                placeholder="Entrez votre adresse mail" 
                                onChange={(e) => { 
                                    setUserLogin({
                                      ...userLogin,
                                      email: e.target.value,
                                    });
                                }}
                                onBlur={(e) => emailControl (e.target.value)}
                                value={userLogin.email}
                            />
                            <FontAwesomeIcon icon={faEnvelope} className={classes.iconInput}/>
                        </div>

                        <div id="errorMsg" className={classes.control_error} ref={refSignupEmailError} />

                        {/* Champ Password */}
                        <div className={classes.control}>
                            <input 
                                type={passwordType}
                                id='password' 
                                maxLength="25" 
                                ref={passwordInputRef} 
                                placeholder="Entrez votre mot de passe" 
                                onChange={(e) => {
                                    setUserLogin({
                                      ...userLogin,
                                      password: e.target.value,
                                    });
                                    checkPassword(e.target.value)
                                }}
                                onBlur={(e) => checkPassword(e.target.value)}
                                value={userLogin.password}
                            />
                            <FontAwesomeIcon icon={faLock} className={classes.iconInput}/>

                            <div className={classes.iconInputEye}>
                                <button className={classes.iconEye} onClick={togglePassword}>
                                    { passwordType === "password" ? 
                                        <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />
                                    }
                                </button>
                            </div>
                        </div>

                        <div className={classes.control_error} ref={refSignupPasswordError}></div>
                    </div>

                    {/* Contrôle du bouton si l'authentification est OK. */}
                    {confirm ? (
                        <div className={classes.loading}></div>
                        ) : (
                        <Button> Se connecter </Button>   
                    )}
                    
                    <div className={classes.text} >
                        <p> Vous n'avez pas de compte ? </p>

                        <Link to="/signup">
                            <p> Inscrivez-vous </p>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login