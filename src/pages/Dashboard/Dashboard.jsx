import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import firebase from "../../utils/firebase";
import "firebase/compat/auth";
import Login from "../Login";
import Orders from "../../components/Orders/Orders";

const Dashboard = ({user}) => {

  return (
    <div className="container mx-auto py-4">
      {user ? <Orders /> : <Login />}
    </div>
  );
};

export default Dashboard;
