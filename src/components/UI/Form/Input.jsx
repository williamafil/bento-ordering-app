import React from "react";

const Input = ({ id, type, name, value, className, onChange, checked }) => {
  return (
    <>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        className={className}
        onChange={onChange}
        checked={checked}
      />
    </>
  );
};

export default Input;
