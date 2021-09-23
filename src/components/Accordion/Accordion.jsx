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
          {/* {children.length === 0 && <p>Empty</p>} */}
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
  price,
  item,
}) => {
  return (
    <div className={clxs("bg-gray-100")}>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        className="sr-only"
      />

      <label
        htmlFor={id}
        className="flex justify-between items-center cursor-pointer"
      >
        <span className="text-sm">
          {label} <b className="text-xs italic">${price}</b>
        </span>
        <Icons.Plus
          className={clxs(classes["item-icon"], "text-gray-700 h-6 w-6")}
        />
      </label>

      <div className={classes["item-content"]}>
        <ul className="text-xs font-medium mt-2">
          <li>醬料</li>
          <li className="pl-2 font-light">{item.sauce.name}</li>
          <li>澱粉類</li>
          <li className="pl-2 font-light">
            {item.starch.selected.map((x, i) => (
              <span key={`st-${i}`}>{x.name}, </span>
            ))}
          </li>
          <li>蔬果類</li>
          <li className="pl-2 font-light">
            {item.veggie.selected.map((x, i) => (
              <span key={`vg-${i}`}>{x.name}, </span>
            ))}
          </li>
          <li>堅果類</li>
          <li className="pl-2 font-light">
            {item.nuts.selected.map((x, i) => (
              <span key={`nt-${i}`}>{x.name}, </span>
            ))}
          </li>
        </ul>
      </div>
    </div>
  );
};
