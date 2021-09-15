import React from "react";
import clxs from "../../../utils/clxs";

const Button = ({ type, value, className, disabled }) => {
  return (
    <button
      type={type}
      className={clxs(
        className,
        "hover:bg-gray-50",
        disabled && "bg-gray-200 text-gray-300 cursor-not-allowed",
      )}
      disabled={disabled}
    >
      {value}
    </button>
  );
};

export default Button;
