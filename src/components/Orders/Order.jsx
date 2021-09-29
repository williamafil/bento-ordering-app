import React, { Fragment, useEffect, useState } from "react";
import OrderStatusAction from "./OrderStatusAction";
import firebase from "../../utils/firebase";
import "firebase/compat/database";
import clxs from "../../utils/clxs";
import { badgeColor, badgeLabel } from "../../utils/badge";

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    department: "Optimization",
    role: "Admin",
    email: "jane.cooper@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  // More people...
];

const Order = ({ order }) => {
  const [orderStatus, setOrderStatus] = useState(order.status);

  useEffect(() => {
    const orderRef = firebase.database().ref("Orders/" + order.id);

    orderRef.on("value", (snapshot) => {
      console.log("更新：", snapshot.val());
      const status = snapshot.val().status;
      setOrderStatus(status);
    });
  }, []);

  return (
    <article>
      <input
        id={order.id}
        name="order-accordion"
        type="radio"
        className="peer sr-only"
      />
      {/* :: Order */}
      <label
        htmlFor={order.id}
        className="w-full flex items-center peer-checked:bg-gray-100"
      >
        <div className="w-4/12 px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full"
                src={people[0].image}
                alt=""
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {order.name}
              </div>
              <div className="text-sm text-gray-500">{order.phone}</div>
            </div>
          </div>
        </div>
        <div className="w-3/12 px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {order.timestamp}
              </div>
              <div className="text-sm text-gray-500">{order.notes}</div>
            </div>
          </div>
          <div className="text-sm text-gray-500"> </div>
        </div>
        <div className="w-2/12 px-6 py-2 whitespace-nowrap">
          <span
            className={clxs(
              "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
              badgeColor(orderStatus),
            )}
          >
            {badgeLabel(orderStatus)}
          </span>
        </div>
        <div className="w-2/12 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          ${order.total}
        </div>
        <div className="w-1/12 px-6 py-4 whitespace-nowrap text-right text-sm font-medium"></div>
      </label>
      {/* :: Order Detail */}
      <div className="max-h-0 overflow-hidden peer-checked:max-h-full">
        <div className="px-6 pt-1 pb-4 bg-gray-100 whitespace-nowrap">
          <ol className="list-inside list-decimal">
            {order.bentos.map((item, index) => (
              <Fragment key={`${item.mainCourse.name}-${index}`}>
                <li className="mt-2">
                  <span className="tracking-wide border-b-2 border-gray-600">
                    {item.mainCourse.name}
                  </span>
                  <span className="ml-2 text-xs font-light italic ">
                    ${item.price}
                  </span>
                </li>
                <ul className="ml-5 list-inside list-disc">
                  <li>
                    醬汁:{" "}
                    <span className="text-xs py-1 px-2 rounded-sm bg-white shadow-sm">
                      {item.sauce.name}
                    </span>
                  </li>
                  <li>
                    澱粉類:{" "}
                    {item.starch.selected.map((starchItem, idx) => (
                      <Fragment key={`${starchItem.name}-${idx}`}>
                        <span className="text-xs py-1 px-2 mr-1 rounded-sm bg-white shadow-sm">
                          {starchItem.name}
                        </span>
                      </Fragment>
                    ))}
                  </li>
                  <li>
                    蔬果類:{" "}
                    {item.veggie.selected.map((veggieItem, idx) => (
                      <Fragment key={`${veggieItem.name}-${idx}`}>
                        <span className="text-xs py-1 px-2 mr-1 rounded-sm bg-white shadow-sm">
                          {veggieItem.name}
                        </span>
                      </Fragment>
                    ))}
                  </li>
                  <li>
                    堅果類{" "}
                    {item.nuts.selected.map((nutsItem, idx) => (
                      <Fragment key={`${nutsItem.name}-${idx}`}>
                        <span className="text-xs py-1 px-2 mr-1 rounded-sm bg-white shadow-sm">
                          {nutsItem.name}
                        </span>
                      </Fragment>
                    ))}
                  </li>
                </ul>
              </Fragment>
            ))}
          </ol>
          <div className="pt-10 text-right">
            <OrderStatusAction
              currentStatus={order.status}
              orderId={order.id}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default Order;
