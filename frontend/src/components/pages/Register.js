import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { axiosHandler } from "../helper";
import { REGISTER_URL } from "../utils/urls";
import { AuthForm, loginRequest } from "./Login";
import logo from "../../assets/logo.png"


const Register = (props) => {
  const [registerData, setRegisterData] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    var result = axios.post(REGISTER_URL, registerData,
    ).then(res => {
      loginRequest(registerData, props);

    }).catch((error) => {
      console.log(error);
    })
  };

  const onChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="loginContainer">
      <div className="inner">
        <img className="logo" src={logo}></img>
        <div className="title">Sign up</div>
        <AuthForm
          data={registerData}
          onSubmit={submit}
          onChange={onChange}
        />
        <div className="switchOption">
          Already got an account? <Link className="link" to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;