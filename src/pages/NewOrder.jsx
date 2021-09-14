import React, { useState, useEffect, useReducer } from "react";
import classes from "./NewOrder.module.css";
import clxs from "../utils/clxs";
import firebase from "../utils/firebase";
import "firebase/compat/firestore";
import Fieldset from "../components/UI/Form/Fieldset";
import Legend from "../components/UI/Form/Legend";
import Loading from "../components/UI/Layout/Loading";
import Input from "../components/UI/Form/Input";
import AsideCard from "../components/UI/AsideCard";

const USER_SELECT = "USER_SELECT";
const INITIALIZE_CHECKS = "INITIALIZE_CHECKS";

const mainCourseReducer = (state, action) => {
  switch (action.type) {
    case USER_SELECT:
      return {
        selected: parseInt(action.payload.index),
        isValid: true,
        subtotal: parseInt(action.payload.price),
      };
    default:
      return state;
  }
};

const sauceReducer = (state, action) => {
  switch (action.type) {
    case USER_SELECT:
      return {
        selected: parseInt(action.payload),
        isValid: true,
      };
    default:
      return state;
  }
};

const starchReducer = (state, action) => {
  switch (action.type) {
    case USER_SELECT:
      const newCopy = [...state.selected];
      let subtotal = state.subtotal;

      if (action.payload.checked) {
        newCopy[action.payload.index].checked = true;
        const prevTotalChecks = state.selected.filter(
          (item) => item.checked,
        ).length;
        if (prevTotalChecks > 1) {
          subtotal += newCopy[action.payload.index].price;
        }
      } else {
        newCopy[action.payload.index].checked = false;
        subtotal -= newCopy[action.payload.index].price;
      }

      return {
        selected: newCopy,
        isValid: newCopy.filter((item) => item.checked).length >= 1,
        subtotal,
      };
    case INITIALIZE_CHECKS:
      return { ...state, selected: action.payload };
    default:
      return state;
  }
};

const veggieReducer = (state, action) => {
  switch (action.type) {
    case USER_SELECT:
      const newCopy = [...state.selected];
      let subtotal = state.subtotal;

      if (action.payload.checked) {
        newCopy[action.payload.index].checked = true;
        const prevTotalChecks = state.selected.filter(
          (item) => item.checked,
        ).length;
        if (prevTotalChecks > 7) {
          subtotal += newCopy[action.payload.index].price;
        }
      } else {
        newCopy[action.payload.index].checked = false;
        subtotal -= newCopy[action.payload.index].price;
      }

      return {
        selected: newCopy,
        isValid: newCopy.filter((item) => item.checked).length >= 7,
        subtotal,
      };
    case INITIALIZE_CHECKS:
      return { ...state, selected: action.payload };
    default:
      return state;
  }
};

const nutsReducer = (state, action) => {
  switch (action.type) {
    case USER_SELECT:
      const newCopy = [...state.selected];
      let subtotal = state.subtotal;

      if (action.payload.checked) {
        newCopy[action.payload.index].checked = true;
        const prevTotalChecks = state.selected.filter(
          (item) => item.checked,
        ).length;
        if (prevTotalChecks > 1) {
          subtotal += newCopy[action.payload.index].price;
        }
      } else {
        newCopy[action.payload.index].checked = false;
        subtotal -= newCopy[action.payload.index].price;
      }

      return {
        selected: newCopy,
        isValid: newCopy.filter((item) => item.checked).length >= 1,
        subtotal,
      };
    case INITIALIZE_CHECKS:
      return { ...state, selected: action.payload };
    default:
      return state;
  }
};

const NewOrder = () => {
  const [menu, setMenu] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bentoPrice, setBentoPrice] = useState(0);

  // ::: useReducer
  const [mainCourse, dispatchMainCourse] = useReducer(mainCourseReducer, {
    selected: "",
    isValid: null,
    subtotal: 0,
  });
  const [sauce, dispatchSauce] = useReducer(sauceReducer, {
    selected: "",
    isValid: null,
  });
  const [starch, dispatchStarch] = useReducer(starchReducer, {
    selected: [],
    isValid: null,
    subtotal: 0,
  });

  const [veggie, dispatchVeggie] = useReducer(veggieReducer, {
    selected: [],
    isValid: null,
    subtotal: 0,
  });

  const [nuts, dispatchNuts] = useReducer(nutsReducer, {
    selected: [],
    isValid: null,
    subtotal: 0,
  });

  // ::: Fetch data from firebase
  useEffect(() => {
    firebase
      .firestore()
      .collection("restaurantMenu")
      .get()
      .then((res) => {
        const data = res.docs.reduce((accumulator, current) => {
          accumulator[current.id] = current.data();
          return accumulator;
        }, {});

        setMenu(data);
        setIsLoading(false);
      })
      .catch((error) => {
        const msg = error.code + " - " + error.message;
        setError(msg);
        setIsLoading(false);
      });
  }, []);

  // ::: calculate bento price
  useEffect(() => {
    let total = 0;
    total =
      mainCourse.subtotal + starch.subtotal + veggie.subtotal + nuts.subtotal;
    setBentoPrice(total);
  }, [mainCourse.subtotal, starch.subtotal, veggie.subtotal, nuts.subtotal]);

  // ::: Set default array with extra checked: boolean in each obj,
  // ::: for controlled checkboxs
  useEffect(() => {
    if (!isLoading) {
      const initializeStarchChecks = menu.starch.options.map((item, index) => {
        return { ...item, id: index, checked: false };
      });
      dispatchStarch({
        type: INITIALIZE_CHECKS,
        payload: initializeStarchChecks,
      });

      const initializeVeggieChecks = menu.veggie.options.map((item, index) => {
        return { ...item, id: index, checked: false };
      });
      dispatchVeggie({
        type: INITIALIZE_CHECKS,
        payload: initializeVeggieChecks,
      });

      const initializeNutsChecks = menu.nuts.options.map((item, index) => {
        return { ...item, id: index, checked: false };
      });
      dispatchNuts({
        type: INITIALIZE_CHECKS,
        payload: initializeNutsChecks,
      });
    }
  }, [isLoading]);

  const onChangeRadioHandler = (event) => {
    switch (event.target.name) {
      case "mainCourse":
        dispatchMainCourse({
          type: USER_SELECT,
          payload: {
            index: event.target.value,
            price: menu.mainCourse.options[event.target.value].price,
          },
        });
        break;
      case "sauce":
        dispatchSauce({
          type: USER_SELECT,
          payload: event.target.value,
        });
        break;
      default:
        break;
    }
  };

  const onChangeCheckboxHandler = (event) => {
    switch (event.target.name) {
      case "starch":
        dispatchStarch({
          type: USER_SELECT,
          payload: { checked: event.target.checked, index: event.target.value },
        });
        break;
      case "veggie":
        dispatchVeggie({
          type: USER_SELECT,
          payload: { checked: event.target.checked, index: event.target.value },
        });
        break;
      case "nuts":
        dispatchNuts({
          type: USER_SELECT,
          payload: { checked: event.target.checked, index: event.target.value },
        });
        break;
      default:
        break;
    }
  };

  return isLoading ? (
    <Loading />
  ) : (
    <main className="container mx-auto py-4">
      <h2 className="text-center text-xl font-semibold">建立訂單</h2>

      <div className="flex">
        <section className="w-8/12">
          <form>
            {/* ::: MAIN COURSE */}
            <Fieldset>
              <Legend
                header={menu.mainCourse.header}
                error={mainCourse.isValid}
              />

              <div className="flex flex-col border border-black">
                {menu.mainCourse.options.map((item, index) => {
                  return (
                    <div key={`mainCourse-${index}`}>
                      <Input
                        id={`mainCourse-${index}`}
                        type="radio"
                        name="mainCourse"
                        value={index}
                        className="m-4"
                        onChange={onChangeRadioHandler}
                        checked={mainCourse.selected === index}
                      />
                      <label htmlFor={`mainCourse-${index}`}>
                        {item.name} <b>${item.price}</b>
                      </label>
                    </div>
                  );
                })}
              </div>
            </Fieldset>

            {/* ::: SAUCE */}
            <Fieldset>
              <Legend header={menu.sauce.header} error={sauce.isValid} />

              <div className="flex flex-col border border-black">
                {menu.sauce.options.map((item, index) => {
                  return (
                    <div key={`sauce-${index}`}>
                      <Input
                        id={`sauce-${index}`}
                        type="radio"
                        name="sauce"
                        value={index}
                        className="m-4"
                        onChange={onChangeRadioHandler}
                        checked={sauce.selected === index}
                      />
                      <label htmlFor={`sauce-${index}`}>{item.name}</label>
                    </div>
                  );
                })}
              </div>
            </Fieldset>

            {/* ::: STARCH */}
            <Fieldset>
              <Legend header={menu.starch.header} error={starch.isValid} />
              <div className="flex flex-wrap border border-black">
                {starch.selected.map((item, index) => {
                  return (
                    <div key={`starch-${index}`}>
                      <Input
                        id={`starch-${index}`}
                        type="checkbox"
                        name="starch"
                        value={index}
                        className="m-4"
                        onChange={onChangeCheckboxHandler}
                        check={item.checked}
                      />
                      <label htmlFor={`starch-${index}`}>{item.name}</label>
                    </div>
                  );
                })}
              </div>
            </Fieldset>

            {/* ::: VEGGIE */}
            <Fieldset>
              <Legend header={menu.veggie.header} error={veggie.isValid} />
              <div className="flex flex-wrap border border-black">
                {veggie.selected.map((item, index) => {
                  return (
                    <div key={`veggie-${index}`}>
                      <Input
                        id={`veggie-${index}`}
                        type="checkbox"
                        name="veggie"
                        value={index}
                        className="m-4"
                        onChange={onChangeCheckboxHandler}
                        check={item.checked}
                      />
                      <label htmlFor={`veggie-${index}`}>{item.name}</label>
                    </div>
                  );
                })}
              </div>
            </Fieldset>

            {/* ::: NUTS */}
            <Fieldset>
              <Legend header={menu.nuts.header} error={nuts.isValid} />
              <div className="flex flex-wrap border border-black">
                {nuts.selected.map((item, index) => {
                  return (
                    <div key={`nuts-${index}`}>
                      <Input
                        id={`nuts-${index}`}
                        type="checkbox"
                        name="nuts"
                        value={index}
                        className="m-4"
                        onChange={onChangeCheckboxHandler}
                        check={item.checked}
                      />
                      <label htmlFor={`nuts-${index}`}>{item.name}</label>
                    </div>
                  );
                })}
              </div>
            </Fieldset>
          </form>
        </section>

        <aside className="w-4/12 pl-2 mt-2">
          <AsideCard label="配置便當">
            <ul>
              <li>
                <b>主食：</b>
                {mainCourse.isValid && (
                  <>
                    {menu.mainCourse.options[mainCourse.selected].name} - $
                    {menu.mainCourse.options[mainCourse.selected].price}
                  </>
                )}
              </li>
              <li>
                <b>醬汁：</b>
                {sauce.isValid && menu.sauce.options[sauce.selected].name}
              </li>
              <li>
                <b>澱粉類：</b>
                <ul className="ml-8">
                  {starch.selected
                    .filter((item) => item.checked)
                    .map((item, index) => (
                      <li
                        className={clxs(
                          "list-decimal",
                          index >= 1 && "text-red-500",
                        )}
                        key={`${item.id}-checkedStarch`}
                      >
                        {item.name}
                        {index >= 1 && <> - ${item.price}</>}
                      </li>
                    ))}
                </ul>
              </li>
              <li>
                <b>蔬果類：</b>
                <ul className="ml-8">
                  {veggie.selected
                    .filter((item) => item.checked)
                    .map((item, index) => (
                      <li
                        className={clxs(
                          "list-decimal",
                          index >= 7 && "text-red-500",
                        )}
                        key={`${item.id}-checkedStarch`}
                      >
                        {item.name}
                        {index >= 7 && <> - ${item.price}</>}
                      </li>
                    ))}
                </ul>
              </li>
              <li>
                <b>堅果：</b>
                <ul className="ml-8">
                  {nuts.selected
                    .filter((item) => item.checked)
                    .map((item, index) => (
                      <li
                        className={clxs(
                          "list-decimal",
                          index >= 1 && "text-red-500",
                        )}
                        key={`${item.id}-checkedStarch`}
                      >
                        {item.name}
                        {index >= 1 && <> - ${item.price}</>}
                      </li>
                    ))}
                </ul>
              </li>
              <li className="bg-gray-100 p-2">
                <b>便當價格： $ {bentoPrice}</b>
              </li>
            </ul>
          </AsideCard>
        </aside>
      </div>
    </main>
  );
};

export default NewOrder;
