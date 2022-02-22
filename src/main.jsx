import React from "react";
import ReactDOM from "react-dom";
import { NotificationProvider } from "./contexts/notification-context";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
