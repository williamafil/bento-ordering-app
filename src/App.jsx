import React from "react";
import Header from "./components/Header/Header";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NewOrder from "./pages/NewOrder";
import Menu from "./pages/Menu";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/menu">
          <Menu />
        </Route>
        <Route path="/order">
          <NewOrder />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
