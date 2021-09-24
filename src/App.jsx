import React, { useState, useEffect } from "react";
import Header from "./components/header/Header";
import "./App.css";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import NewOrder from "./pages/NewOrder";
import Menu from "./pages/Menu";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

import firebase from "./utils/firebase";
import "firebase/compat/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      console.log("app user: ", currentUser);
      setUser(currentUser);
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <Header />
        <main className="flex">
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
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/adm">
              {/* {user ? <Dashboard /> : <Redirect to="/login" />} */}
              <Dashboard />
            </Route>
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
