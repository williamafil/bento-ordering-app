import React from "react";

const Input = ({
  id,
  type,
  name,
  value,
  className,
  onChange,
  checked,
  disabled,
  custom,
}) => {
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
        disabled={disabled}
        custom={custom?.toString()}
      />
    </>
  );
};

export default Input;
