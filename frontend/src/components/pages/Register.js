import React, { useState } from "react";
import { Link } from "react-router-dom";
import { axiosHandler } from "../helper";
import { REGISTER_URL } from "../utils/urls";
import { AuthForm } from "./Login";

const Register = (props) => {
  const [registerData, setRegisterData] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    const result = await axiosHandler({
      method: "post",
      url: REGISTER_URL,
      data: registerData,
    }).catch((e) => console.log(e));
    console.log(result);
    // if (result) {
    //   await loginRequest(registerData, setError, props);
    // }
    // setLoading(false);
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
        <div className="logo">Chat App</div>
        <div className="title">Sign up</div>
        <AuthForm
          data={registerData}
          onSubmit={submit}
          onChange={onChange}
        />
        <div className="switchOption">
          Already got an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;