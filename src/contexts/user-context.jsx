import React, { createContext, useState } from "react";

const initialState = {
  currentUser: null,
  isLoggedIn: false,
  login: (userObj) => {},
  logout: () => {},
};

const retrieveUser = () => {
  const storedUser = JSON.parse(localStorage.getItem("currentUser"));
  return storedUser;
};

export const UserContext = createContext(initialState);

export const UserContextProvider = ({ children }) => {
  const currentUser = retrieveUser();
  const [user, setUser] = useState(currentUser);

  const logoutHandler = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const loginHandler = (userObj) => {
    const userDetail = {
      displayName: userObj._delegate.displayName,
      email: userObj._delegate.email,
      photoURL: userObj._delegate.photoURL,
    };
    setUser(userDetail);
    localStorage.setItem("currentUser", JSON.stringify(userDetail));
  };

  const contextValue = {
    user,
    isLoggedIn: !!user,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
