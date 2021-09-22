import React from "react";
import classes from "./Modal.module.css";

const Backdrop = (props) => {
  return (
    <div className={classes["backdrop-dark"]} onClick={props.onClose}></div>
  );
};

export default Backdrop;
