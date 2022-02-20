import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import firebase from "../../utils/firebase";
import "firebase/compat/database";
import {
  orderStatusMachine,
  resettledAction,
} from "../../machine/orderStatusMachine";
import clxs from "../../utils/clxs";
import { badgeColor, actionLabel } from "../../utils/badge";

const currentState = (current) => {
  switch (current) {
    case "pending":
      return "pending";
    case "inProgress":
      return "inProgress";
    case "ready":
      return "ready";
    case "delivered":
      return "delivered";
    case "canceled":
      return "canceled";
    default:
      break;
  }
};

const OrderStatusAction = (props) => {
  const [current, send] = useMachine(orderStatusMachine, {
    actions: {
      resettledAction,
    },
  });

  useEffect(() => {
    switch (props.currentStatus) {
      case "inProgress":
        send("PROCEEDING");
        break;
      case "ready":
        send("PROCEEDING");
        send("READY_TO_GO");
        break;
      case "delivered":
        send("PROCEEDING");
        send("READY_TO_GO");
        send("DELIVERED");
        break;
      case "canceled":
        send("CANCELING");
        break;
      default:
        break;
    }
  }, []);

  const onUpdateStatusHandler = (event, action, status = "pending") => {
    event.preventDefault();

    console.log("props.orderId: ", props.orderId);
    const orderRef = firebase.database().ref("Orders/" + props.orderId);
    orderRef.update({ status }).then((res) => {
      console.log("res: ", res);
      send(action);
    });
  };

  return (
    <div className="space-x-4">
      {current.matches("pending") ? (
        <>
          <button
            type="button"
            className={clxs(
              "px-6 py-3 rounded-full  text-sm tracking-wider font-semibold",
              badgeColor("inProgress"),
            )}
            onClick={(event) =>
              onUpdateStatusHandler(event, "PROCEEDING", "inProgress")
            }
          >
            {actionLabel("PROCEEDING")}
          </button>
          <button
            type="button"
            className={clxs(
              "px-6 py-3 rounded-full  text-sm tracking-wider font-semibold",
              badgeColor("canceled"),
            )}
            onClick={(event) =>
              onUpdateStatusHandler(event, "CANCELING", "canceled")
            }
          >
            {actionLabel("CANCELING")}
          </button>
        </>
      ) : null}

      {current.matches("inProgress") ? (
        <>
          <button
            type="button"
            className={clxs(
              "px-6 py-3 rounded-full  text-sm tracking-wider font-semibold",
              badgeColor("ready"),
            )}
            onClick={(event) =>
              onUpdateStatusHandler(event, "READY_TO_GO", "ready")
            }
          >
            {actionLabel("READY_TO_GO")}
          </button>

          <button
            type="button"
            className={clxs(
              "px-6 py-3 rounded-full  text-sm tracking-wider font-semibold",
              badgeColor("canceled"),
            )}
            onClick={(event) =>
              onUpdateStatusHandler(event, "CANCELING", "canceled")
            }
          >
            {actionLabel("CANCELING")}
          </button>
        </>
      ) : null}

      {current.matches("ready") ? (
        <>
          <button
            type="button"
            className={clxs(
              "px-6 py-3 rounded-full  text-sm tracking-wider font-semibold",
              badgeColor("delivered"),
            )}
            onClick={(event) =>
              onUpdateStatusHandler(event, "DELIVERED", "delivered")
            }
          >
            {actionLabel("DELIVERED")}
          </button>
        </>
      ) : null}

      {current.matches("delivered") ? (
        <>
          <button
            type="button"
            className={clxs(
              "cursor-not-allowed",
              "px-6 py-3 rounded-full text-sm tracking-wider font-semibold",
              "bg-gray-200 text-gray-400",
            )}
            disabled
          >
            訂單已完成
          </button>
        </>
      ) : null}

      {current.matches("canceled") ? (
        <>
          <button
            type="button"
            className={clxs(
              "px-6 py-3 rounded-full text-sm tracking-wider font-semibold",
              badgeColor(),
            )}
            onClick={(event) => onUpdateStatusHandler(event, "RESET")}
          >
            {actionLabel("RESET")}
          </button>
        </>
      ) : null}
    </div>
  );
};

export default OrderStatusAction;
