import React, { useState, useEffect } from "react";
import classes from "./NewOrder.module.css";
import clxs from "../utils/clxs";
import firebase from "../utils/firebase";
import "firebase/compat/firestore";
import Fieldset from "../components/UI/Form/Fieldset";
import Legend from "../components/UI/Form/Legend";
import Loading from "../components/UI/Layout/Loading";

// TODO: setup loader
// 1. TODO: fetch data
// 2. TODO: setData
// 3. TODO: render data to <fieldset> data </fieldset>

const NewOrderLayout = () => {
  return (
    <main className="container mx-auto py-4">
      <h2 className="text-center text-xl font-semibold">建立訂單</h2>

      <div className="flex">
        <section className="w-8/12">
          <form>
            <Fieldset>
              <div>DIV</div>
            </Fieldset>
          </form>
        </section>
        <aside className="w-4/12 pl-2 mt-2">
          <div className="">配置便當</div>
          <ul className="border border-black p-3">
            <li>主食：</li>
            <li>醬汁：</li>
            <li>澱粉類：</li>
            <li>
              蔬果類：
              <ul className="ml-8">
                <li className="list-decimal">foo</li>
              </ul>
            </li>
            <li>堅果：</li>
            <li>Price：</li>
          </ul>
        </aside>
      </div>
    </main>
  );
};

const NewOrder = () => {
  const [menu, setMenu] = useState({ mainCourse: {} });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        console.log("data: ", data);
        setMenu(data);
        setIsLoading(false);
      })
      .catch((error) => {
        const msg = error.code + " - " + error.message;
        setError(msg);
        setIsLoading(false);
      });
  }, []);

  return isLoading ? <Loading /> : <NewOrderLayout />;
};

export default NewOrder;
