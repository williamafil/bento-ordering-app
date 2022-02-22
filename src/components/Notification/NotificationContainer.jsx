import React, { useContext } from "react";
import { NoticeContext } from "../../contexts/notification-context";
import NoticeBox from "./NoticeBox";

const NotificationContainer = () => {
  const { state, dispatch } = useContext(NoticeContext);

  const onCloseHandler = (id) => {
    dispatch({ type: "REMOVE_NOTICE", payload: id });
  };

  return (
    <div className="absolute -top-6 w-full">
      {state.notices.map((n) => (
        <NoticeBox key={n.id} notice={n} onClose={onCloseHandler} />
      ))}
    </div>
  );
};

export default NotificationContainer;
