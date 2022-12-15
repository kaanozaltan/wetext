import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom';
import { axiosHandler, getToken, LastUserChat } from './helper';
import Loader from './Loader';
import { userDetailAction } from './stateManagement/actions';
import { store } from './stateManagement/store';
import { LOGOUT_URL, ME_URL } from './utils/urls';

export const tokenName = "token";

export const logout = async (props) => {
    const token = localStorage.getItem(tokenName)
    if (token) {
        await axiosHandler({
            method: "get",
            url: LOGOUT_URL,
            token: token,
        }).then((res) => {
            localStorage.removeItem(tokenName);
            localStorage.removeItem("activeFriend");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            props.history.push("/login");
        })
    }

};

export const checkAuthState = async (setChecking, dispatch, props) => {
    let token = localStorage.getItem(tokenName);
    if (!token) {
        logout(props);
        return;
    }
    localStorage.setItem('token', token)
    var userProfile = axios.get(ME_URL, {
        headers: {
            'Authorization': `Token ${token}`
        }
    }).then(res => {
        localStorage.setItem('user', JSON.stringify(res.data));
        dispatch({ type: userDetailAction, payload: res.data })
    }).catch((error) => {
        console.log(error);
    })

    userProfile = JSON.parse(localStorage.getItem("user"));
    setChecking(false);
};

const AuthController = (props) => {
    const [checking, setChecking] = useState(true)

    const { dispatch } = useContext(store);
    const user = JSON.parse(localStorage.getItem("user"))
    if(!user){
        props.history.push('/login')
    }
    useEffect(() => {
        checkAuthState(setChecking, dispatch, props);
    }, []);

    return (
        <div className="authContainer">
            {checking ? (
                <div className="centerAll">
                    <Loader />
                </div>
            ) : (
                props.children
            )}
        </div>
    );
}

export default AuthController