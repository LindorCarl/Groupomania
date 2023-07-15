import { useContext, useRef, useState } from "react";
import classes from "./authForm.module.css";
import Button from "../UI/Button";
import Logo from "../../assets/icon-above-font.png";
import {Link, useNavigate} from "react-router-dom";
import avatar from "../../assets/ava.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../store/AuthContext";

const SignUp = () => {
    const [display, setDisplay] = useState(false);
    const [passwordType, setPasswordType] = useState("password");
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [confirm, setConfirm] = useState(false)
    const [userSignup, setUserSignup] = useState({ 
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    const [passwordFlag, setPasswordFlag] = useState({
        length: false,
        min: false,
        maj: false,
        num: false,
    });

    const [userType, setUserType] = useState("")
    const [secretKey, setSecretKey] = useState("")
    const authCtx = useContext(AuthContext);

    //Pour récupérer les réferences du formulaire. 
    const refSignupFirstName = useRef();
    const refSignupLastName = useRef()
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const refSignupAdmin = useRef();

    //Afficher les erreurs au niveau des input. 
    const refSignupFirstNameError = useRef();
    const refSignupLastNameError = useRef();
    const refSignupEmailError = useRef();
    const refSignupPasswordError = useRef();
    const refKeyError = useRef();
    const refSignupUserError = useRef();
    const infosDisplay = useRef();
    
    const navigate = useNavigate()
    const adminKey = process.env.REACT_APP_ADMIN_SECRETKEY
    
    //Fonction pour enregistrer les données des "input".
    const submitHandler = () => { 
        if(userType === "Admin" && secretKey !== adminKey){ 
            refKeyError.current.innerText = " Veuillez rentrer une clé valide.";
            document.getElementById("secretKey").style.border="2px solid rgb(211, 47, 47)";
            
        }else{ 
        //Récupérer les valeurs.
        const firstNameValue = refSignupFirstName.current.value;
        const lastNameValue = refSignupLastName.current.value;
        const emailValue = emailInputRef.current.value;
        const passwordValue = passwordInputRef.current.value;

        const url = "http://localhost:3000/api/authentification/signup"
        const fetchHandler = async () => {
            try{ 
                const response = await fetch(url, {
                    method : "POST",
                    body : JSON.stringify({
                        firstname : firstNameValue,
                        lastname : lastNameValue,
                        email : emailValue,
                        password : passwordValue,
                        photoProfilUrl : "",
                        userId : authCtx.userId,
                        userType
                        
                    }),
                    headers : {
                        "Content-Type" : "application/json"
                    }
                })
                
                const dataResponse = await response.json()
                    
                if(response.ok){
                    setDisplay(true)
                    infosDisplay.current.innerText = dataResponse.message
                    setTimeout(() => navigate("/", { replace: true }), 3000);
                    setConfirm(true)
                }else{
                    dataResponse.error === undefined ? refSignupPasswordError.current.innerText = "" : refSignupPasswordError.current.innerText = dataResponse.error
                    document.getElementById("email").style.border="2px solid rgb(211, 47, 47)"
                    dataResponse.email === undefined ? refSignupEmailError.current.innerText = "" : refSignupEmailError.current.innerText = dataResponse.email
                }
            }catch(err){
                console.log(err)
            };    
        }
        fetchHandler()
        }
    }

   
    // ===> Changer la couleur du checkbox. 
    const radioColor = () => {
        const checked = refSignupAdmin && refSignupAdmin.current.checked
        if(checked === false){
            setUserType("")
            document.getElementById("admin").style.border= ""
        }else{
            setUserType("Admin")
            document.getElementById("admin").style.border= "2px solid #2ecc71"
        }
    }

    // ===> Contrôler la clé administrateur.
    const adminControl = () => {
        if(userType === "Admin" && secretKey === ""){ 
            refKeyError.current.innerText = " Veuillez rentrer une clé.";
            document.getElementById("secretKey").style.border="2px solid rgb(211, 47, 47)";
        }else if(userType === "Admin" && secretKey !== ""){ 
            refKeyError.current.innerText = "";
            document.getElementById("secretKey").style.border="2px solid #2ecc71";
        }
    }
    
    //Variables.
    const {firstname, lastname, email} = userSignup;

    // ===> Prénom.
    const checkFirstName = () => {
        if (firstname === "") {
            refSignupFirstNameError.current.innerText = "Veuillez entrer un prénom.";
            document.getElementById("firstname").style.border="2px solid rgb(211, 47, 47)";
            return false
        } else if ( firstname.trim().length < 2 || firstname.trim().length > 30) {
            refSignupFirstNameError.current.innerText =
            "Votre prénom doit faire entre 2 et 30 caractères.";
            document.getElementById("firstname").style.border="2px solid rgb(211, 47, 47)";
            return false
           
        } else {
            refSignupFirstNameError.current.innerText = "";
            document.getElementById("firstname").style.border="2px solid #2ecc71"
            return true;
        }
    };

    // ===> Nom.
    const checkLastName = () => {
        if (lastname === "") {
            refSignupLastNameError.current.innerText = "Veuillez entrer un nom.";
            document.getElementById("lastname").style.border="2px solid rgb(211, 47, 47)";
        } else if (lastname.trim().length < 2 || lastname.trim().length > 30) {
            refSignupLastNameError.current.innerText =
            "Votre nom doit faire entre 2 et 30 caractères.";
            document.getElementById("lastname").style.border="2px solid rgb(211, 47, 47)";
            return false
        } else {
            refSignupLastNameError.current.innerText = "";
            document.getElementById("lastname").style.border="2px solid #2ecc71"
            return true;
        }
    };

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
        setPasswordFocus(true);
        const flags = {
            length: false,
            min: false,
            maj: false,
            num: false,
        };

        if (password && password.length >= 10) {
            flags.length = true;
        }
        if (password && password.match(/[a-z]/, "g")) {
            flags.min = true;
        }
        if (password && password.match(/[A-Z]/, "g")) {
            flags.maj = true;
        }
        if (password && password.match(/[0-9]/, "g")) {
            flags.num = true;
        }
        setPasswordFlag((prev) => ({ ...prev, ...flags }));;
     
        if (flags.length && flags.min && flags.maj && flags.num){ 
            document.getElementById("password").style.border="2px solid #2ecc71";
            refSignupPasswordError.current.innerText = "";
            return true
        }else {
            document.getElementById("password").style.border="2px solid rgb(211, 47, 47)";
            refSignupPasswordError.current.innerText = "Le mot de passe n'est pas assez fort."
        }
    };

    const {length, min, maj, num} = passwordFlag;
    const passwordCheck = () => {
        if(length && min && maj && num){
            return true
        }else{
            document.getElementById("password").style.border="2px solid rgb(211, 47, 47)";
            refSignupPasswordError.current.innerText = "Veuillez entrer un mot de passe."
        }
    }

    // ===> Requête fetch si tout est OK.
    const validity = (e) => { 
        e.preventDefault()
        if((checkFirstName() && checkLastName() && emailControl() && passwordCheck())){
            submitHandler()
        }
    }

    // ===> password hide and show. 
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
            <div className= {display ? classes.confirm : ""} ref={infosDisplay}/>
                
            <div className={classes.auth}>
                <img src={Logo} alt="Logo" className={classes.logo}/>

                <h2> Inscrivez-vous </h2>

                <form onSubmit={validity}>

                    <div className={classes.form}>
                        
                        <div className={classes.radio}>

                            <div className={classes.radio_text} id="admin" onClick={radioColor}>
                                <input
                                    type="checkbox"
                                    id="User"
                                    name="UserType"
                                    value="Admin"
                                    onBlur={(e) => adminControl(e.target.value)}
                                    ref={refSignupAdmin}
                                />
                                Administrateur
                            </div>
                        </div>
                        <div className={classes.control_error} ref={refSignupUserError}></div>
                        
                        {/* ==> clé secrète */}
                        {userType === "Admin" ? (  
                            <>
                                <div className={classes.secretKey}>
                                    <input
                                        type="text"
                                        placeholder="Clé secrète"
                                        id="secretKey"
                                        name="secretKey"
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        onBlur={(e) => adminControl(e.target.value)}
                                    />
                                    <FontAwesomeIcon icon={faKey} className={classes.iconInput}/>
                                </div> 
                                <div className={classes.control_error} ref={refKeyError} ></div>
                            </>
                        ) : 
                            <>
                                <div className={classes.hideSecretKey}>
                                    <input
                                        type="text"
                                        placeholder="Clé secrète"
                                        id="secretKey"
                                        name="secretKey"
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        onBlur={(e) => adminControl(e.target.value)}
                                    />
                                    <FontAwesomeIcon icon={faKey} className={classes.iconInput}/>
                                </div> 
                            </>
                        }
                        
                        {/* ==> Prénom */}
                        <div className={classes.control}>
                            <input
                                type="text"
                                placeholder="Prénom"
                                id="firstname"
                                name="firstname"
                                onChange={(e) =>
                                    setUserSignup({
                                        ...userSignup,
                                        firstname: e.target.value,
                                    })
                                }
                                onBlur={(e) => checkFirstName (e.target.value)}
                                value={userSignup.firstname}
                                ref={refSignupFirstName}
                            />
                            <img className={classes.avatar} src={avatar} alt="img"/>
                        </div>
                        <div className={classes.control_error} ref={refSignupFirstNameError}></div>
                            
                        {/* ==> Nom */}
                        <div className={classes.control}>
                            <input
                                type="text"
                                placeholder="Nom"
                                id="lastname"
                                name="lastname"
                                onChange={(e) =>
                                    setUserSignup({
                                        ...userSignup,
                                        lastname: e.target.value,
                                    })
                                }
                                onBlur={(e) =>checkLastName (e.target.value)}
                                value={userSignup.lastname}
                                ref={refSignupLastName}
                            />
                            <img className={classes.avatar} src={avatar} alt="img"/>
                        </div>
                        <div className={classes.control_error} ref={refSignupLastNameError}></div>    

                        {/* ==> Email */}
                        <div className={classes.control}>
                            <input 
                                type='email' 
                                id='email' 
                                ref={emailInputRef} 
                                placeholder="Entrez votre adresse mail" 
                                onChange={(e) =>
                                    setUserSignup({
                                      ...userSignup,
                                      email: e.target.value,
                                    })
                                }
                                onBlur={(e) => emailControl (e.target.value)}
                                value={userSignup.email}
                            />
                            <FontAwesomeIcon icon={faEnvelope} className={classes.iconInput}/>
                        </div>

                        <div className={classes.control_error} ref={refSignupEmailError} />

                        {/* ==> Mot de passe */}
                        <div className={classes.control}>
                            <input  
                                type={passwordType}
                                id='password' 
                                maxLength="25"
                                ref={passwordInputRef} 
                                placeholder="Entrez votre mot de passe" 
                                onChange={(e) => {
                                    setUserSignup({
                                        ...userSignup,
                                        password: e.target.value,
                                    })
                                    checkPassword(e.target.value)
                                }}
                                value={userSignup.password}
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
                    
                    {/* ==> Pour contrôler le Mot de passe */}
                    {passwordFocus ? (
                            <ul className={classes.password_infos}>
                                <div>
                                    <li className={passwordFlag.length ? classes.password_length : ""}>
                                        {passwordFlag.length ? "✔️" : "❌"} Entre 10 et 25 caractères
                                    </li>
                                    <li className={passwordFlag.maj ? classes.password_maj : ""}>
                                        {passwordFlag.maj ? "✔️" : "❌"} Au moins une majuscule
                                    </li>
                                    <li className={passwordFlag.min ? classes.password_min : ""}>
                                        {passwordFlag.min ? "✔️" : "❌"} Au moins une minuscule
                                    </li>
                                    <li className={passwordFlag.num ? classes.password_num : ""}>
                                        {passwordFlag.num ? "✔️" : "❌"} Au moins un chiffre
                                    </li>
                                </div>
                            </ul>
                        ) : null
                    }
                     
                     {/* Contrôle du bouton si l'authentification est OK. */}
                    {confirm ? (
                        <div className={classes.loading}></div>
                        ) : (
                        <Button className={ classes.button}  id ="button" type={"submit"}>
                            S'inscrire
                        </Button>   
                    )}
                    

                    <div className={classes.text}>
                        <p> Vous avez déjà un compte ? </p>

                        <Link to="/">
                            <p> Connectez-vous </p>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignUp;