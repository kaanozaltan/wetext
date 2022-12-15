import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { checkAuthState, tokenName } from "../authController";
import { axiosHandler } from "../helper";
import Loader from "../Loader";
import { LOGIN_URL, ME_URL } from "../utils/urls";
import logo from "../../assets/logo.png"
import axios from "axios";
import { store } from "../stateManagement/store";
import { Alert, Snackbar } from "@mui/material";




export const loginRequest = async (data, props, setOpen, setError) => {

  const result = await axiosHandler({
    method: "post",
    url: LOGIN_URL,
    data: data,
  }).catch((e) => {
    setError(e.response.data.error)
    setOpen(true);
  });
  if (result) {
    await localStorage.setItem(tokenName, result.data.token);
    var userProfile = axios.get(ME_URL, {
      headers: {
        'Authorization': `Token ${result.data.token}`
      }
    }).then(res => {
      localStorage.setItem('user', JSON.stringify(res.data));
      props.history.push("/home");

      // dispatch({type: userDetailAction, payload: res.data})
    }).catch((error) => {
      console.log(error);
    })

  }
};
const Login = (props) => {
  const [loginData, setLoginData] = useState({});
  const [checking, setChecking] = useState(localStorage.getItem(tokenName));
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")


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
    await loginRequest(loginData, props, setOpen, setError);
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
          <img className="logo" src={logo}></img>

          <div className="title">Sign in</div>
          <AuthForm
            login
            data={loginData}
            onSubmit={submit}
            onChange={onChange}
          />
          <div className="switchOption">
            Don’t have an accout yet? <Link className="link" to="/register">Sign up</Link>
          </div>
        </div>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      ><Alert severity="error">{error}</Alert></Snackbar>
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
              name="first_name"
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
              name="last_name"
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