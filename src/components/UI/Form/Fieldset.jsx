import React from "react";
import clxs from "../../../utils/clxs";

const Fieldset = ({ children }) => {
  return (
    <fieldset className={clxs("mt-2 relative overflow-hidden")}>
      {children}
    </fieldset>
  );
};

export default Fieldset;
