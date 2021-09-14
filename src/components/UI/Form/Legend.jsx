import React from "react";

const Legend = (props) => {
  return (
    <legend className="flex items-center  text-white font-semibold cursor-pointer">
      <div className="px-4 py-2 bg-black">{props.header}</div>{" "}
      <div className="bg-white h-full px-4 py-2 text-red-400 text-sm">
        {props.error === false ? "＊此為必填選項" : ""}
      </div>
    </legend>
  );
};

export default Legend;
