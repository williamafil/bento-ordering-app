import React from "react";
import Header from "./components/Header/Header";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NewOrder from "./pages/NewOrder";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact>
          首頁
        </Route>
        <Route path="/menu">菜單</Route>
        <Route path="/order">
          <NewOrder />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
