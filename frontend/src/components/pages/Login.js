import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkAuthState, tokenName } from "../authController";
import { axiosHandler } from "../helper";
import Loader from "../Loader";
import { LOGIN_URL } from "../utils/urls";


export const loginRequest = async (data, props) => {
    console.log(data);
    const result = await axiosHandler({
      method: "post",
      url: LOGIN_URL,
      data: data,
    }).catch((e) => console.log(e));
    console.log(result);
    if (result) {
      localStorage.setItem(tokenName, JSON.stringify(result.data));
      props.history.push("/home");
    }
  };

const Login = (props) => {
  const [loginData, setLoginData] = useState({});
  const [checking, setChecking] = useState(localStorage.getItem(tokenName));


  useEffect(() => {
    if (checking) {
      checkAuthState(
        () => null,
        () => props.history.push("/"),
        props
      );
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    console.log("submit");
    // setLoading(true);
    // setError(null);
    await loginRequest(loginData, props);
    // setLoading(false);
  };

  const onChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="loginContainer">
      {checking ? (
        <div className="centerAll">
          <Loader />
        </div>
      ) : (
        <div className="inner">
          <div className="logo">Chat App</div>
          <div className="title">Sign in</div>
          <AuthForm
            login
            data={loginData}
            onSubmit={submit}
            onChange={onChange}
          />
          <div className="switchOption">
            Don’t have an accout yet? <Link to="/register">Sign up</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export const AuthForm = (props) => {
  return (
    <>
      <form onSubmit={props.onSubmit}>
        <input
          value={props.data.username}
          name="username"
          onChange={props.onChange}
          className="input-field"
          placeholder="Username"
          required
        />
        {!props.login && (
          <div className="input-container">
            <input
              className="input-field"
              placeholder="Name"
              value={props.data.name}
              name="name"
              onChange={props.onChange}
              required
            />
          </div>
        )}
        {!props.login && (
          <div className="input-container">
            <input
              className="input-field"
              placeholder="Surname"
              value={props.data.surname}
              name="surname"
              onChange={props.onChange}
              required
            />
          </div>
        )}
        <div className="input-container">
          <input
            className="input-field"
            placeholder="Password"
            value={props.data.password}
            name="password"
            onChange={props.onChange}
            type={!props.showPassword ? "password" : "text"}
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" disabled={props.loading}>
          {props.loading ? (
            <center>
              <Loader />
            </center>
          ) : props.login ? (
            "Login"
          ) : (
            "Register"
          )}
        </button>
      </form>
    </>
  );
};

export default Login;