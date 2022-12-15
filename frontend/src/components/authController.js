import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { axiosHandler, getToken, LastUserChat } from './helper';
import Loader from './Loader';
import { userDetailAction } from './stateManagement/actions';
import { store } from './stateManagement/store';
import { LOGOUT_URL, ME_URL, REFRESH_URL } from './utils/urls';

export const tokenName = "tokenName";

export const logout = (props) => {
    if (localStorage.getItem(tokenName)) {
        axiosHandler({
            method: "get",
            url: LOGOUT_URL,
            token: getToken(),
        });
    }
    localStorage.removeItem(tokenName);
    localStorage.removeItem("activeFriend");
    localStorage.removeItem("token");
    localStorage.removeItem(LastUserChat);
    props.history.push("/login");
};

export const checkAuthState = async (setChecking, dispatch, props) => {
    let token = localStorage.getItem(tokenName);
    if (!token) {
        logout(props);
        return;
    }
    token = JSON.parse(token);
    localStorage.setItem('token', token.token)

    var userProfile = axios.get(ME_URL, {
        headers: {
            'Authorization': `Token ${token.token}`
        }
    }).then(res => {
        localStorage.setItem('user', JSON.stringify(res.data));
        dispatch({type: userDetailAction, payload: res.data})
    }).catch((error) => {
        console.log(error);
    })

    userProfile = JSON.parse(localStorage.getItem("user"));
    setChecking(false);
};

const AuthController = (props) => {
    const [checking, setChecking] = useState(true)

    const { dispatch } = useContext(store);

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