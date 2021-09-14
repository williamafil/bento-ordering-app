import React, { useState, useEffect } from "react";
import DUMMY_DATA from "../data/dummy-data";
import classes from "./NewOrder.module.css";
import classNames from "../utils/clxs";
import firebase from "../utils/firebase";
import "firebase/compat/firestore";

const NewOrder = () => {
  const [mainCourse, setMainCourse] = useState({});
  const [sauce, setSauce] = useState({});
  const [starch, setStarch] = useState({});
  const [veggie, setVeggie] = useState([]);
  const [nuts, setNuts] = useState({});
  const [mainCoursePrice, setMainCoursePrice] = useState(0);
  const [veggiePrice, setVeggiePrice] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);

  const [optValidations, setOptValidations] = useState({
    mainCourse: null,
    sauce: null,
    starch: null,
    veggie: null,
    nuts: null,
  });
  const [tabMainCourse, setTabMainCourse] = useState(true);

  useEffect(() => {
    firebase
      .firestore()
      .collection("restaurantMenu")
      .get()
      .then((res) => {
        // console.log(res.docs[0].id);
        // const data = res.docs.map((doc) => {
        //   return doc.data();
        // });

        const data = res.docs.reduce((accumulator, current) => {
          accumulator[current.id] = current.data();
          return accumulator;
        }, {});

        console.log("data: ", data);
      });
  }, []);

  useEffect(() => {
    setCurrentTotal(mainCoursePrice + veggiePrice);
  }, [mainCoursePrice, veggiePrice]);

  function mainCourseHandler(e) {
    const selectedMainCourse = DUMMY_DATA.mainCourse.options[e.target.value];
    setMainCourse(selectedMainCourse);
    setMainCoursePrice(selectedMainCourse.price);
    // setCurrentTotal(selectedMainCourse.price);
  }

  function sauceHandler(e) {
    const selectedSauce = DUMMY_DATA.sauce.options[e.target.value];
    setSauce(selectedSauce);
  }

  function starchHandler(e) {
    const selectedStarch = DUMMY_DATA.starch.options[e.target.value];
    setStarch(selectedStarch);
  }

  function vegPriceHandler(arr) {
    let extraPrice = 0;
    arr.map((item) => (extraPrice += item.price));
    return extraPrice;
  }

  function extraVeggieArray(arr) {
    if (arr.length > 7) {
      const extraVeggies = arr.slice(7, arr.length + 1);
      const calcExtraVeggiesPrice = vegPriceHandler(extraVeggies);
      setVeggiePrice(calcExtraVeggiesPrice);
    } else {
      setVeggiePrice(0);
    }
  }

  function veggieHandler(e) {
    if (e.target.checked) {
      setVeggie((prevState) => {
        const newState = [
          ...prevState,
          DUMMY_DATA.veggie.options[e.target.value],
        ];

        extraVeggieArray(newState);
        return newState;
      });
    } else {
      const term = DUMMY_DATA.veggie.options[e.target.value].name;

      setVeggie((prevState) => {
        const resultIndex = prevState.findIndex((item) => item.name === term);
        const newState = [
          ...prevState.slice(0, resultIndex),
          ...prevState.slice(resultIndex + 1, prevState.length),
        ];

        extraVeggieArray(newState);
        return newState;
      });
    }
  }

  function nutsHandler(e) {
    const selectedNuts = DUMMY_DATA.nuts.options[e.target.value];
    setNuts(selectedNuts);
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    if (
      Object.keys(mainCourse).length &&
      Object.keys(sauce).length &&
      Object.keys(starch).length &&
      veggie.length >= 7 &&
      Object.keys(nuts).length
    ) {
      console.log("ok");
    } else {
      console.log("NOT ok");
      Object.keys(optValidations).map((key) => {
        console.log(Object.keys(key));
        console.log(Object.keys([key]));

        if (Object.keys(key).length) {
          setOptValidations((prevState) => ({ ...prevState, [key]: false }));
        } else {
          setOptValidations((prevState) => ({ ...prevState, [key]: true }));
        }
      });
    }
  }

  return (
    <main className="container mx-auto py-4">
      <h2 className="text-center text-xl font-semibold">建立訂單</h2>

      <div className="flex">
        <section className="w-8/12">
          <form onSubmit={onSubmitHandler}>
            {/* :::MAIN COURSE */}
            <fieldset className="mt-2 relative">
              {optValidations["mainCourse"] && (
                <div className="absolute -right-4 text-red-500">
                  * 必須要選擇一樣主食
                </div>
              )}
              <legend
                className={classes["options-legend"]}
                onClick={() => setTabMainCourse((prevState) => !prevState)}
              >
                {DUMMY_DATA.mainCourse.header}
              </legend>

              <div
                className={classNames(
                  "flex flex-col border border-black overflow-hidden",
                  tabMainCourse ? "h-full" : "h-0",
                )}
              >
                {DUMMY_DATA.mainCourse.options.map((option, index) => {
                  return (
                    <div key={`mainCourse-${index}`}>
                      <input
                        className="m-4"
                        type="radio"
                        id={`mainCourse-${index}`}
                        name="mainCourse"
                        value={index}
                        onChange={mainCourseHandler}
                      />
                      <label htmlFor={`mainCourse-${index}`}>
                        <b>${option.price}</b> - {option.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            {/* :::SAUCE */}
            <fieldset className="mt-2">
              <legend className={classes["options-legend"]}>
                {DUMMY_DATA.sauce.header}
              </legend>

              <div className="flex flex-col border border-black">
                {DUMMY_DATA.sauce.options.map((option, index) => {
                  return (
                    <div key={`sauce-${index}`}>
                      <input
                        className="m-4"
                        type="radio"
                        id={`sauce-${index}`}
                        name="sauce"
                        value={index}
                        onChange={sauceHandler}
                      />
                      <label htmlFor={`sauce-${index}`}>{option.name}</label>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            {/* :::STARCH */}
            <fieldset className="mt-2">
              <legend className={classes["options-legend"]}>
                {DUMMY_DATA.starch.header}
              </legend>

              <div className="flex flex-col border border-black">
                {DUMMY_DATA.starch.options.map((option, index) => {
                  return (
                    <div key={`starch-${index}`}>
                      <input
                        className="m-4"
                        type="radio"
                        id={`starch-${index}`}
                        name="starch"
                        value={index}
                        onChange={starchHandler}
                      />
                      <label htmlFor={`starch-${index}`}>{option.name}</label>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            {/* :::VEGGIE */}
            <fieldset className="mt-2">
              <legend className={classes["options-legend"]}>
                {DUMMY_DATA.veggie.header}
              </legend>

              <div className="flex flex-wrap border border-black">
                {DUMMY_DATA.veggie.options.map((option, index) => {
                  return (
                    <div key={`veggie-${index}`}>
                      <input
                        className="m-4"
                        type="checkbox"
                        id={`veggie-${index}`}
                        name="veggie"
                        value={index}
                        onChange={veggieHandler}
                      />
                      <label htmlFor={`veggie-${index}`}>{option.name}</label>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            {/* :::NUTS */}
            <fieldset className="mt-2">
              <legend className={classes["options-legend"]}>
                {DUMMY_DATA.nuts.header}
              </legend>

              <div className="flex flex-col border border-black">
                {DUMMY_DATA.nuts.options.map((option, index) => {
                  return (
                    <div key={`nuts-${index}`}>
                      <input
                        className="m-4"
                        type="radio"
                        id={`nuts-${index}`}
                        name="nuts"
                        value={index}
                        onChange={nutsHandler}
                      />
                      <label htmlFor={`nuts-${index}`}>{option.name}</label>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <div className="space-x-4">
              <button
                type="submit"
                className="mt-4 px-6 py-2 border border-black"
              >
                加入此便當
              </button>
            </div>
          </form>
        </section>
        <aside className="w-4/12 pl-2 mt-2">
          <div className={`inline-block ${classes["options-legend"]}`}>
            配置便當
          </div>
          <ul className="border border-black p-3">
            <li>主食：{mainCourse && mainCourse.name}</li>
            <li>醬汁：{sauce && sauce.name}</li>
            <li>澱粉類：{starch && starch.name}</li>
            <li>
              蔬果類：
              <ul className="ml-8">
                {veggie.map((item, index) => (
                  <li
                    className={classNames(
                      "list-decimal",
                      index >= 7 && "text-red-500",
                    )}
                    key={`veggie-${index}`}
                  >
                    {item.name}
                    {index >= 7 && <> - ${item.price}</>}
                  </li>
                ))}
              </ul>
            </li>
            <li>堅果：{nuts && nuts.name}</li>
            <li>此便當價格：{currentTotal}</li>
          </ul>
        </aside>
      </div>
    </main>
  );
};

export default NewOrder;
