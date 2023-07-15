import {Link, NavLink} from "react-router-dom";
import classes from "./MainHeader.module.css";
import Logo from "../../assets/logo.svg";
import { useContext } from "react";
import AuthContext from '../store/AuthContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPowerOff} from "@fortawesome/free-solid-svg-icons";

const MainHeader = () => {

    const authCtx = useContext(AuthContext);
    
    return(
        <>
            <div className= {classes.nav}>
                <Link to="/home">
                    <img src={Logo} alt="Logo" className={classes.logo}/>
                </Link>

                <div className= {classes.nav_icon}>
                    <NavLink to= "/home" className={({isActive}) => (isActive ? classes.active : classes.text)} >
                        <div className={classes.flex}>
                            <i className="fa-solid fa-house"></i>
                        </div> 
                    </NavLink>

                    <NavLink to= "/user" className={({isActive}) => (isActive ? classes.active : classes.text)}>
                        <div className={classes.flex}>
                            <i className="fa-solid fa-user icon"/>
                        </div>
                    </NavLink>
                    
                    <Link to="/">
                        <div className={classes.powerOff}>
                            <FontAwesomeIcon onClick={authCtx.logout} icon={faPowerOff} />
                        </div>
                    </Link>
                </div>
                
            </div>
        </>
    )
}

export default MainHeader;
