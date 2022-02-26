import React, { useContext } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import NewOrder from "./pages/NewOrder";
import Header from "./components/header/Header";
import Dashboard from "./pages/Dashboard/Dashboard";
import { UserContext } from "./contexts/user-context";
import "./App.css";

function App() {
  const { user, isLoggedIn, logout } = useContext(UserContext);

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <Header user={user} logout={logout} />
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
              {isLoggedIn ? (
                <Dashboard user={user} />
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
