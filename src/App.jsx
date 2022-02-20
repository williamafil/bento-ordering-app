import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import firebase from "./utils/firebase";
import "firebase/compat/auth";
import Login from "./pages/Login";
import NewOrder from "./pages/NewOrder";
import { Header } from "./components/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <Header />
        <main className="flex-auto">
          <Switch>
            <Route path="/" exact>
              <Redirect to="/order" />
            </Route>
            <Route path="/order">
              <NewOrder />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/adm">
              {user ? <Dashboard /> : <Redirect to="/login" />}
            </Route>
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
