import React, { useEffect, useState, useContext } from "react";
import { NoticeContext } from "../../contexts/notification-context";
import firebase from "../../utils/firebase";
import "firebase/compat/database";

import { Notifications } from "../Notification";
import Order from "./Order";

const Orders = () => {
  const { state, dispatch } = useContext(NoticeContext);
  console.log("notices state: ", state);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  const [orders, setOrders] = useState([]);

  // const ordersRef = firebase
  //   .database()
  //   .ref("/Orders")
  //   .orderByChild("timestamp");
  // console.log("ordersRef:", ordersRef);

  // const onListenChildAdded = () => {
  //   ordersRef.on("child_added", (snapshot) => {
  //     if (initialLoad) {
  //       console.log("有新訂單");
  //       setOrders((prevState) => {
  //         const convertedDatetime = new Date(
  //           snapshot.val().timestamp,
  //         ).toLocaleString("en-US", {
  //           year: "numeric",
  //           month: "short",
  //           day: "numeric",
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         });
  //         return [
  //           {
  //             ...snapshot.val(),
  //             timestamp: convertedDatetime,
  //             id: snapshot.key,
  //           },
  //           ...prevState,
  //         ];
  //       });
  //     }
  //   });
  // };

  useEffect(() => {
    const ordersRef = firebase
      .database()
      .ref("/Orders")
      .orderByChild("timestamp");
    console.log("ordersRef:", ordersRef);

    ordersRef.on("child_added", (snapshot) => {
      // NEW ORDER LISTENER

      const convertedDatetime = new Date(
        snapshot.val().timestamp,
      ).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      setOrders((prevState) => {
        return [
          {
            ...snapshot.val(),
            createdAt: convertedDatetime,
            id: snapshot.key,
          },
          ...prevState,
        ];
      });

      dispatch({
        type: "SET_NOTICE",
        payload: {
          type: "NEW",
          id: snapshot.key,
          name: snapshot.val().name,
          createdAt: snapshot.val().timestamp,
        },
      });
    });
    setIsLoading(false);
    console.log("setIsLoading to false");
    setInitialLoad(true);
  }, []);

  if (isLoading) {
    return <div className="pt-20 text-center">Loading</div>;
  }

  return (
    <div className="relative">
      <Notifications />
      <div className="container max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-10">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 max-w-6xl">
          <div className="mx-auto py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <div className="min-w-full divide-y divide-gray-200">
                <div className="bg-gray-50">
                  <header className="flex ">
                    <div className="w-4/12 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </div>
                    <div className="w-3/12 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time / Notes
                    </div>
                    <div className=" w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </div>
                    <div className=" w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </div>
                    <div className="w-1/12 relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </div>
                  </header>
                </div>

                <section className="divide-y divide-gray-200">
                  <form>
                    {isLoading && orders.length === 0 && (
                      <>
                        {console.log("i am loading")}
                        <div className="pt-20 text-center text-black">
                          Loading...
                        </div>
                      </>
                    )}
                    {!isLoading &&
                      orders.map((order) => (
                        <Order key={order.id} order={order} />
                      ))}
                  </form>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
