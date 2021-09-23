import React, { useState } from "react";
import Icons from "../components/Icons";
import clxs from "../utils/clxs";
import { useHistory } from "react-router-dom";
import firebase from "../utils/firebase";
import "firebase/compat/auth";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (event) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
    }
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    setIsLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log("res: ", res);
        setIsLoading(false);
        history.push("/adm");
      })
      .catch((error) => {
        console.log("error: ", error);
        console.log("error.code: ", error.code);
        setIsLoading(false);
        switch (error.code) {
          case "auth/invalid-email":
            setErrorMsg("信箱格式不正確");
            break;
          case "auth/user-not-found":
            setErrorMsg("使用者不存在");
            break;
          case "auth/wrong-password":
            setErrorMsg("密碼錯誤");
            break;
        }
      });
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full space-y-1">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-4 text-center text-sm text-red-600">{errorMsg}</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmitHandler}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="h-14 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={onChangeHandler}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="h-14 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={onChangeHandler}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={clxs(
                "group relative h-12 w-full",
                "flex justify-center items-center py-2 px-4",
                "border border-transparent text-sm rounded-md",
                "text-white bg-indigo-600 font-medium",
                "hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                isLoading && "disabled cursor-default",
              )}
            >
              {isLoading ? <Icons.Loading /> : "Sign In "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
