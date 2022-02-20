import React, { Fragment, useEffect, useState } from "react";
import "firebase/compat/database";
import firebase from "../../utils/firebase";
import clxs from "../../utils/clxs";
import OrderStatusAction from "./OrderStatusAction";
import { badgeColor, badgeLabel } from "../../utils/badge";

const Order = ({ order }) => {
  const [orderStatus, setOrderStatus] = useState(order.status);

  useEffect(() => {
    const orderRef = firebase.database().ref("Orders/" + order.id);

    orderRef.on("value", (snapshot) => {
      const status = snapshot.val().status;
      setOrderStatus(status);
    });
  }, []);

  return (
    <article
      className={clxs("border border-t border-gray-100", "sm:border-none")}
    >
      <input
        id={order.id}
        name="order-accordion"
        type="radio"
        className="peer sr-only"
      />
      {/* :: Order */}
      <label
        htmlFor={order.id}
        className="py-4 w-full flex flex-wrap sm:flex-nowrap sm:flex-row items-center peer-checked:bg-gray-100"
      >
        <div
          className={clxs(
            "order-1 w-3/4",
            "sm:order-none",
            "sm:px-6 sm:py-4 sm:w-4/12 sm:whitespace-nowrap",
          )}
        >
          <div className="flex items-center">
            <div className="ml-4">
              <div
                className={clxs(
                  "text-base font-semibold text-gray-900",
                  "sm:text-sm",
                )}
              >
                {order.name}
              </div>
              <div className="text-sm text-gray-500">{order.phone}</div>
            </div>
          </div>
        </div>
        <div
          className={clxs(
            "order-3 w-3/4",
            "sm:order-none",
            "sm:px-6 sm:py-4 sm:w-3/12 lg:whitespace-nowrap",
          )}
        >
          <div className="text-sm text-gray-900">
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {order.timestamp}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500"> </div>
        </div>
        <div
          className={clxs(
            "order-2 w-1/4 text-right",
            "sm:order-none sm:text-center",
            "sm:w-2/12 sm:px-6 sm:py-2 sm:whitespace-nowrap",
          )}
        >
          <span
            className={clxs(
              "mr-4 px-3 py-1 inline-flex text-xs leading-5 font-light rounded-full",
              "sm:py-0 sm:px-2 sm:font-semibold",
              badgeColor(orderStatus),
            )}
          >
            {badgeLabel(orderStatus)}
          </span>
        </div>
        <div
          className={clxs(
            "order-4 text-gray-800 w-1/4 font-bold text-right",
            "sm:order-none sm:text-left",
            "sm:text-sm sm:w-2/12 sm:px-6 sm:py-4 sm:whitespace-nowrap ",
          )}
        >
          <span className="mr-5">${order.total}</span>
        </div>
        <div className="sr-only w-1/12 px-6 py-4 whitespace-nowrap text-right text-sm font-medium"></div>
      </label>
      {/* :: Order Detail */}
      <div className={clxs("max-h-0 overflow-hidden peer-checked:max-h-full")}>
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
