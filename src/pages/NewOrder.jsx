import React, { useState, useEffect, useReducer } from "react";
import classes from "./NewOrder.module.css";
import clxs from "../utils/clxs";
import firebase from "../utils/firebase";
import "firebase/compat/firestore";
import Fieldset from "../components/UI/Form/Fieldset";
import Legend from "../components/UI/Form/Legend";
import Loading from "../components/UI/Layout/Loading";
import Input from "../components/UI/Form/Input";

const USER_SELECT = "USER_SELECT";
const INITIALIZE_CHECKS = "INITIALIZE_CHECKS";

const mainCourseReducer = (state, action) => {
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
      console.log(state);
      const newCopy = [...state.selected];

      if (action.payload.checked) {
        newCopy[action.payload.index].checked = true;
      } else {
        newCopy[action.payload.index].checked = false;
      }

      return {
        selected: newCopy,
        isValid: newCopy.filter((item) => item.checked).length >= 1,
      };
    case INITIALIZE_CHECKS:
      return {
        selected: action.payload,
        isValid: null,
      };
  }
};

const NewOrder = () => {
  const [menu, setMenu] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [mainCourse, dispatchMainCourse] = useReducer(mainCourseReducer, {
    selected: "",
    isValid: null,
  });
  const [sauce, dispatchSauce] = useReducer(sauceReducer, {
    selected: "",
    isValid: null,
  });
  const [starch, dispatchStarch] = useReducer(starchReducer, {
    selected: [],
    isValid: null,
  });

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

  const onChangeRadioHandler = (event) => {
    switch (event.target.name) {
      case "mainCourse":
        dispatchMainCourse({
          type: USER_SELECT,
          payload: event.target.value,
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
    console.log("check ", event.target.checked);
    console.log("value ", event.target.value);
    console.log("name", event.target.name);

    switch (event.target.name) {
      case "starch":
        dispatchStarch({
          type: USER_SELECT,
          payload: { checked: event.target.checked, index: event.target.value },
        });
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (!isLoading) {
      const initializeChecks = menu.starch.options.map((item, index) => {
        return { ...item, id: index, checked: false };
      });
      dispatchStarch({
        type: INITIALIZE_CHECKS,
        payload: initializeChecks,
      });
      console.log("initializeChecks ", initializeChecks);
    }

    console.log("isLoading: ", isLoading);
    // setIsChecked(initialIsChecked);
  }, [isLoading]);

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
              <Legend header={menu.mainCourse.header} />

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
                      <label htmlFor={`mainCourse-${index}`}>{item.name}</label>
                    </div>
                  );
                })}
              </div>
            </Fieldset>

            {/* ::: SAUCE */}
            <Fieldset>
              <Legend header={menu.sauce.header} />

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
              <Legend header={menu.starch.header} />
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
          </form>
        </section>
        <aside className="w-4/12 pl-2 mt-2">
          <div className="">配置便當</div>
          <ul className="border border-black p-3">
            <li>
              主食：
              {mainCourse.isValid &&
                menu.mainCourse.options[mainCourse.selected].name}
            </li>
            <li>
              醬汁：
              {sauce.isValid && menu.sauce.options[sauce.selected].name}
            </li>
            <li>
              澱粉類：
              <ul className="ml-8">
                {starch.selected
                  .filter((item) => item.checked)
                  .map((item) => (
                    <li
                      className="list-decimal"
                      key={`${item.id}-checkedStarch`}
                    >
                      {item.name}
                    </li>
                  ))}
              </ul>
            </li>
            <li>
              蔬果類：
              <ul className="ml-8"></ul>
            </li>
            <li>堅果：</li>
            <li>Price：</li>
          </ul>
        </aside>
      </div>
    </main>
  );
};

export default NewOrder;
