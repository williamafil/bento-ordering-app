import React from "react";
import ReactDOM from "react-dom";
import { UserContextProvider } from "./contexts/user-context";
import { NotificationProvider } from "./contexts/notification-context";

import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
