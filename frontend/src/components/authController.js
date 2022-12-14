import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { axiosHandler, getToken, LastUserChat } from './helper';
import Loader from './Loader';
import { userDetailAction } from './stateManagement/actions';
import { store } from './stateManagement/store';
import { LOGOUT_URL, ME_URL, REFRESH_URL } from './utils/urls';

export const tokenName = "tokenName";

export const logout = (props) => {
    // console.log(props);
    if (localStorage.getItem(tokenName)) {
        axiosHandler({
            method: "get",
            url: LOGOUT_URL,
            token: getToken(),
        });
    }
    localStorage.removeItem(tokenName);
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
    // const response = await axios.get(`/me?token=${token.access}`);
    // console.log(response);

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
    // console.log(userProfile);
    setChecking(false);

    // const userProfile = await axiosHandler({
    //     method: "get",
    //     url: ME_URL,
    //     token: token.access,
    // }).catch((e) => {

    //     console.log("error");
    //     console.log(e);
    // });
    // if (userProfile) {
    //     setChecking(false);
    //     dispatch({ type: userDetailAction, payload: userProfile.data });
        // } else {
        //     const getNewAccess = await axiosHandler({
        //         method: "post",
        //         url: REFRESH_URL,
        //         data: {
        //             refresh: token.refresh,
        //         },
        //     }).catch((e) => null);
        //     if (getNewAccess) {
        //         localStorage.setItem(tokenName, JSON.stringify(getNewAccess.data));
        //         checkAuthState(setChecking, dispatch, props);
        //     } else {
        //         logout(props);
        //     }
    // }
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