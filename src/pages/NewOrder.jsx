import React, {
  Fragment,
  useState,
  useEffect,
  useReducer,
  useRef,
} from "react";
import classes from "./NewOrder.module.css";
import clxs from "../utils/clxs";
import firebase from "../utils/firebase";
import "firebase/compat/firestore";
import "firebase/compat/database";
import Fieldset from "../components/UI/Form/Fieldset";
import Legend from "../components/UI/Form/Legend";
import Loading from "../components/UI/Layout/Loading";
import Input from "../components/UI/Form/Input";
import AsideCard from "../components/UI/Card/AsideCard";
import Button from "../components/UI/Button/Button";
import ContactForm from "../components/ContactForm";
import Icons from "../components/Icons";
import {
  AccordionGroup,
  AccordionItem,
} from "../components/Accordion/Accordion";

const USER_SELECT = "USER_SELECT";
const INITIALIZE_CHECKS = "INITIALIZE_CHECKS";
const RESET_FORM = "RESET_FORM";

const mainCourseReducer = (state, action) => {
  switch (action.type) {
    case USER_SELECT:
      return {
        selected: parseInt(action.payload.index),
        isValid: true,
        subtotal: parseInt(action.payload.price),
      };
    case RESET_FORM:
      return {
        selected: "",
        isValid: null,
        subtotal: 0,
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
    case RESET_FORM:
      return {
        selected: "",
        isValid: null,
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
      const specialCheckbox = action.payload.isSpecial;

      if (action.payload.checked) {
        newCopy[action.payload.index].checked = true;

        if (specialCheckbox) {
          newCopy.forEach((item) => {
            if (!item.custom) {
              item.checked = false;
              item.disabled = true;
            }
          });
        }
        const currentTotalChecks = newCopy.filter(
          (item) => item.checked,
        ).length;
        console.log("currentTotalChecks: ", currentTotalChecks);
        if (currentTotalChecks > 1) {
          subtotal += newCopy[action.payload.index].price;
        }
      } else {
        newCopy[action.payload.index].checked = false;

        if (specialCheckbox) {
          newCopy.forEach((item) => {
            if (!item.custom) {
              item.disabled = false;
            }
          });
        }

        const currentTotalChecks = newCopy.filter(
          (item) => item.checked,
        ).length;

        if (currentTotalChecks >= 1) {
          subtotal -= newCopy[action.payload.index].price;
        } else {
          subtotal = 0;
        }
      }

      return {
        selected: newCopy,
        isValid: newCopy.filter((item) => item.checked).length >= 1,
        subtotal,
      };
    case INITIALIZE_CHECKS:
      return { ...state, selected: action.payload };
    case RESET_FORM:
      return {
        ...action.payload,
        selected: [
          ...state.selected.map((item) => {
            return { ...item, checked: false };
          }),
        ],
        isValid: null,
        subtotal: 0,
      };
    default:
      return state;
  }
};

const veggieReducer = (state, action) => {
  switch (action.type) {
    case USER_SELECT:
      const newCopy = [...state.selected];

      let subtotal = parseInt(state.subtotal);

      if (action.payload.checked) {
        newCopy[action.payload.index].checked = true;

        const currentTotalChecks = newCopy.filter(
          (item) => item.checked,
        ).length;

        if (currentTotalChecks > 7) {
          subtotal += newCopy[action.payload.index].price;
        } else {
          subtotal = 0;
        }
      } else {
        newCopy[action.payload.index].checked = false;
        const currentTotalChecks = newCopy.filter(
          (item) => item.checked,
        ).length;

        if (currentTotalChecks >= 7) {
          subtotal -= newCopy[action.payload.index].price;
        } else {
          subtotal = 0;
        }
      }

      return {
        selected: newCopy,
        isValid: newCopy.filter((item) => item.checked).length >= 7,
        subtotal,
      };
    case INITIALIZE_CHECKS:
      return { ...state, selected: action.payload };
    case RESET_FORM:
      return {
        selected: state.selected.map((item) => {
          return { ...item, checked: false };
        }),
        isValid: null,
        subtotal: 0,
      };
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

        const currentTotalChecks = newCopy.filter(
          (item) => item.checked,
        ).length;

        if (currentTotalChecks > 1) {
          subtotal += newCopy[action.payload.index].price;
        }
      } else {
        newCopy[action.payload.index].checked = false;
        const currentTotalChecks = newCopy.filter(
          (item) => item.checked,
        ).length;

        if (currentTotalChecks >= 1) {
          subtotal -= newCopy[action.payload.index].price;
        } else {
          subtotal = 0;
        }
      }

      return {
        selected: newCopy,
        isValid: newCopy.filter((item) => item.checked).length >= 1,
        subtotal,
      };
    case INITIALIZE_CHECKS:
      return { ...state, selected: action.payload };
    case RESET_FORM:
      return {
        selected: state.selected.map((item) => {
          return { ...item, checked: false };
        }),
        isValid: null,
        subtotal: 0,
      };
    default:
      return state;
  }
};

const NewOrder = () => {
  const formRef = useRef();
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [menu, setMenu] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [bentoPrice, setBentoPrice] = useState(0);
  const [formIsValid, setFormIsValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactNote, setContactNote] = useState("");
  const [contactFormIsValid, setContactFormIsValid] = useState(false);

  // DESC: useReducer
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

  const { isValid: mainCourseIsValid } = mainCourse;
  const { isValid: sauceIsValid } = sauce;
  const { isValid: starchIsValid } = starch;
  const { isValid: veggieIsValid } = veggie;
  const { isValid: nutsIsValid } = nuts;

  // DESC: Fetching Data From Firebase
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

  // DESC: Bento Price Calculation
  useEffect(() => {
    let total = 0;
    total =
      mainCourse.subtotal + starch.subtotal + veggie.subtotal + nuts.subtotal;
    setBentoPrice((prevState) => {
      return total;
    });
  }, [mainCourse, sauce, starch, veggie, nuts]);

  // DESC: Cart Total Price
  useEffect(() => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price;
    });
    setCartTotal(total);
  }, [cart]);

  // DESC: Bento Form Validation
  useEffect(() => {
    const timer = setTimeout(() => {
      // setFormIsValid(emailState.isValid && passwordState.isValid);
      setFormIsValid(
        mainCourseIsValid &&
          sauceIsValid &&
          starchIsValid &&
          veggieIsValid &&
          nutsIsValid,
      );
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [
    mainCourseIsValid,
    sauceIsValid,
    starchIsValid,
    veggieIsValid,
    nutsIsValid,
  ]);

  // DESC: Contact Form Validation
  useEffect(() => {
    const timer = setTimeout(() => {
      // setFormIsValid(emailState.isValid && passwordState.isValid);
      setContactFormIsValid(contactName.trim() && contactNumber.trim());
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [contactName, contactNumber]);

  // DESC: Set new array with extra checked property
  useEffect(() => {
    if (!isLoading) {
      const initializeStarchChecks = menu.starch.options.map((item, index) => {
        return { ...item, id: index, checked: false, disabled: false };
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

  // DESC: Handler Functions
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
    console.log(event.target);
    switch (event.target.name) {
      case "starch":
        const special = event.target.id.split("-")[1] === "special";
        console.log("checkbox id: ", special);
        // if (special) {
        //   dispatchStarch({
        //     type: DISABLE_OTHER_BOX,
        //     payload: {
        //       checked: event.target.checked,
        //       index: event.target.value,
        //     },
        //   });
        // }
        dispatchStarch({
          type: USER_SELECT,
          payload: {
            isSpecial: special,
            checked: event.target.checked,
            index: event.target.value,
          },
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

  const onSubmitHandler = (event) => {
    console.log("onSubmit triggered");
    event.preventDefault();

    const bento = {
      mainCourse: {
        ...menu.mainCourse.options[mainCourse.selected],
        index: mainCourse.selected,
      },
      sauce: {
        ...menu.sauce.options[sauce.selected],
        index: sauce.selected,
      },
      starch: {
        selected: starch.selected.filter((item) => item.checked),
        subtotal: starch.subtotal,
      },
      veggie: {
        selected: veggie.selected.filter((item) => item.checked),
        subtotal: veggie.subtotal,
      },
      nuts: {
        selected: nuts.selected.filter((item) => item.checked),
        subtotal: nuts.subtotal,
      },
      price: bentoPrice,
    };

    // console.log(bento);
    setCart((prevState) => {
      return [...prevState, bento];
    });

    // RESET STATES
    dispatchMainCourse({
      type: RESET_FORM,
    });
    dispatchSauce({
      type: RESET_FORM,
    });
    dispatchStarch({
      type: RESET_FORM,
      payload: starch,
    });
    dispatchVeggie({
      type: RESET_FORM,
    });
    dispatchNuts({
      type: RESET_FORM,
    });

    // formRef.current.reset();
  };

  const showModalHandler = () => {
    setShowModal(true);
  };

  const hideModalHandler = () => {
    console.log("close");
    setShowModal(false);
  };

  const inputChangeHandler = (event) => {
    console.log(event.target.name);
    switch (event.target.name) {
      case "contact-name":
        setContactName(event.target.value);
        break;
      case "contact-number":
        setContactNumber(event.target.value);
        break;
      case "contact-note":
        setContactNote(event.target.value);
        break;
      default:
        break;
    }
  };

  const onRemoveBentoHandler = (idx) => {
    console.log("remove: ", idx);
    const newCart = cart.filter((item, index) => index !== idx);
    setCart(newCart);
  };

  const onCheckoutHandler = (event) => {
    event.preventDefault();

    const ordersRef = firebase.database().ref("Orders");
    const order = {
      bentos: [...cart],
      name: contactName,
      phone: contactNumber,
      notes: contactNote,
      status: "pending",
    };

    ordersRef
      .push(order)
      .then((res) => {
        console.log("order sent successfully");
        setContactFormIsValid(false);
        setContactName("");
        setContactNumber("");
        setContactNote("");
        setShowModal(false);
      })
      .catch((error) => {
        console.log("something went wrong: ", error);
      });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Fragment>
      {showModal && (
        <ContactForm
          formIsValid={contactFormIsValid}
          contactName={contactName}
          contactNumber={contactNumber}
          contactNote={contactNote}
          onInputHandler={inputChangeHandler}
          onHideModalHandler={hideModalHandler}
          onCheckoutOrder={onCheckoutHandler}
        />
      )}
      <main className="container mx-auto py-4">
        <h2 className="text-center text-xl font-semibold">建立訂單</h2>

        <div className="flex">
          <section className="w-8/12">
            <form ref={formRef} onSubmit={onSubmitHandler}>
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
                          defaultChecked={mainCourse.selected === index}
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
                          id={
                            item.custom ? "starch-special" : `starch-${index}`
                          }
                          type="checkbox"
                          name="starch"
                          value={index}
                          className="m-4"
                          onChange={onChangeCheckboxHandler}
                          checked={item.checked}
                          disabled={item.disabled}
                          custom={item.custom}
                        />
                        <label
                          htmlFor={
                            item.custom ? "starch-special" : `starch-${index}`
                          }
                        >
                          {item.name}
                        </label>
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
                          checked={item.checked}
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
                          checked={item.checked}
                        />
                        <label htmlFor={`nuts-${index}`}>{item.name}</label>
                      </div>
                    );
                  })}
                </div>
              </Fieldset>

              <div className="space-x-4">
                <Button
                  type="submit"
                  value="加入此便當"
                  className={clxs(
                    "mt-4 px-6 py-2 border border-black",
                    !formIsValid &&
                      "cursor-not-allowed text-gray-300 border-gray-300 bg-gray-100",
                  )}
                  disabled={!formIsValid}
                />
              </div>
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
                          key={`${item.id}-${Math.random()}`}
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

            <AccordionGroup legend="購物籃" name="accordion">
              {cart &&
                cart.map((item, index) => {
                  return (
                    <div
                      key={`cart-bento-${index}`}
                      className="flex bg-gray-100 px-2 py-1"
                    >
                      <div className="flex items-start py-1">
                        <Icons.Remove
                          className="w-4 h-4 mr-1 hover:text-red-600 cursor-pointer"
                          onClickCapture={() => onRemoveBentoHandler(index)}
                        />
                      </div>

                      <AccordionItem
                        key={`item-${index}`}
                        id={`item-${index}`}
                        value={item.mainCourse.name}
                        label={item.mainCourse.name}
                        price={item.price}
                        item={item}
                      />
                    </div>
                  );
                })}
              {cart.length === 0 ? (
                <>購物車是空的</>
              ) : (
                <div className="bg-gray-100 font-semibold p-2 flex justify-between">
                  <p>總計： </p>
                  <p>$ {cartTotal}</p>
                </div>
              )}
            </AccordionGroup>
            <button
              onClick={showModalHandler}
              className={clxs(
                "float-right",
                "border border-black px-4 py-2",
                "hover:bg-gray-200",
                cart.length <= 0 &&
                  "cursor-not-allowed text-gray-300 border-gray-300 bg-gray-100",
              )}
              disabled={cart.length <= 0}
            >
              下一步
            </button>
          </aside>
        </div>
      </main>
    </Fragment>
  );
};

export default NewOrder;
