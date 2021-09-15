import React, { cloneElement, Children } from "react";
import Icons from "../Icons";
import clxs from "../../utils/clxs";
import classes from "./Accordion.module.css";

export const AccordionGroup = ({ children, name, legend }) => {
  return (
    <form className="mb-2">
      <fieldset>
        <legend className="px-4 py-2 bg-black text-white font-semibold inline-block">
          {legend}
        </legend>

        <div className="border border-black p-3 space-y-2">
          {Children.map(children, (child) => cloneElement(child, { name }))}
        </div>
      </fieldset>
    </form>
  );
};

export const AccordionItem = ({
  type = "checkbox",
  id,
  name,
  value,
  label,
}) => {
  return (
    <div className={clxs("bg-gray-100 py-1 px-2")}>
      <input type={type} id={id} name={name} value={value} className="sr-only" />

      <label htmlFor={id} className="flex justify-between items-center ">
        <span>{label}</span>
        <Icons.Plus
          className={clxs(classes["item-icon"], "text-gray-700 h-6 w-6")}
        />
      </label>

      <div className={classes["item-content"]}>
        <ul>
          <li>a</li>
          <li>b</li>
          <li>c</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
          <li>6</li>
          <li>7</li>
          <li>8</li>
          <li>9</li>
          <li>0</li>
        </ul>
      </div>
    </div>
  );
};
