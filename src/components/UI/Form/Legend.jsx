import React from "react";

const Legend = (props) => {
  return (
    <legend className="bg-black text-white font-semibold px-4 py-2 cursor-pointer">
      {props.header}
    </legend>
  );
};

export default Legend;
