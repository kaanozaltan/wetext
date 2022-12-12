import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../Loader";


const Login = (props) => {
  const [loginData, setLoginData] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    console.log(loginData);
  };

  const onChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="loginContainer">
      {false ? (
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
              placeholder="Email Address"
              value={props.data.email}
              name="email"
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