import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { REGISTER_URL } from "../utils/urls";
import { AuthForm, loginRequest } from "./Login";
import logo from "../../assets/logo.png"
import { Alert, Snackbar } from "@mui/material";


const Register = (props) => {
  const [registerData, setRegisterData] = useState({});
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const submit = async (e) => {
    e.preventDefault();
    var result = axios.post(REGISTER_URL, registerData,
    ).then(res => {
      loginRequest(registerData, props);

    }).catch((error) => {
      console.log(error);
      const errMes = capitalizeFirstLetter(error.response.data.username[0]);
      setOpen(true)
      setError(errMes);

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
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      ><Alert severity="error">{error}</Alert></Snackbar>
    </div>
  );
};

export default Register;