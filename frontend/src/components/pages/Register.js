import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthForm } from "./Login";

const Register = (props) => {
  const [registerData, setRegisterData] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    console.log(registerData);
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