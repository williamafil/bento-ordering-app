import React from "react";

const Input = ({ id, type, name, value, className, onChange }) => {
  return (
    <>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        className={className}
        onChange={onChange}
      />
    </>
  );
};

export default Input;
