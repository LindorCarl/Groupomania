import classes from "./Modal.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

const Modal = (props) => {
    return (
        <>
            <div className={classes.backdrop}>
                <div className={classes.modal}>
                    <header className={classes.title}>
                        <div > {props.title} </div>
                        <FontAwesomeIcon icon={faXmark}  onClick={props.unDelete} className={classes.faXmark} />
                    </header>

                    <div className={classes.message}> {props.message} </div>

                    <div className={classes.confirm}>
                        <button className={classes.buttonOk} onClick={props.onConfirm} > Oui </button>
                        <button className={classes.buttonReturn} onClick={props.unDelete}> Non </button>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default Modal;