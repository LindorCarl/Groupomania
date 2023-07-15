import classes from "./Modal.module.css";

const SessionModal = (props) => {
    return (
        <>
            <div className={classes.backdrop}>
                <div className={classes.modal}>
                    <header className={classes.title}>
                        <div > {props.title} </div>
                    </header>

                    <div className={classes.message}> {props.message} </div>

                    <div className={classes.buttonAlign}>
                        <button className={classes.buttonSession} onClick={props.onConfirm} > OK </button>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default SessionModal;