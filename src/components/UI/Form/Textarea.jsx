import React from "react";

const Textarea = ({ id, type, name, rows, value, className, onChange, checked }) => {
  return (
    <>
      <textarea
        id={id}
        name={name}
        type={type}
        rows={rows}
        value={value}
        className={className}
        onChange={onChange}
      />
    </>
  );
};

export default Textarea;
