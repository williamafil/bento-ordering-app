import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import firebase from "../../utils/firebase";
import "firebase/compat/auth";
import Login from "../Login";
import Orders from "../../components/Orders/Orders";

const Dashboard = () => {
  const [user, setUser] = useState(true);

  useEffect(() => {
    let mounted = true;

    firebase.auth().onAuthStateChanged((currentUser) => {
      if (mounted) {
        console.log("app user: ", currentUser);
        setUser(currentUser);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return <>{user ? <Orders /> : <Login />}</>;
};

export default Dashboard;
