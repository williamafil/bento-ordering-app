import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import Backdrop from "./Backdrop";

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal}>
      <button
        className="float-right text-xs font-medium tracking-wider"
        onClick={props.onClose}
      >
        關閉
      </button>
      <div className="clear-right"></div>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
  const portalElement = document.getElementById("overlays");

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onCloseModal} />,
        portalElement,
      )}
      {ReactDOM.createPortal(
        <ModalOverlay onClose={props.onCloseModal}>
          {props.children}
        </ModalOverlay>,
        portalElement,
      )}
    </Fragment>
  );
};

export default Modal;
