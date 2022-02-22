import React, { useEffect } from "react";
import { Icons } from "../Icons";

const NoticeBox = ({ onClose, notice }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notice.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="my-3 p-2 mx-auto w-60 bg-gray-200 rounded-md opacity-80 border-t-2 border-green-200 flex justify-between">
      <p>有一筆新訂單 - {notice.name}</p>{" "}
      <Icons.Plus
        className="w-5 rotate-45 cursor-pointer"
        onClick={() => onClose(notice.id)}
      />
    </div>
  );
};

export default NoticeBox;
