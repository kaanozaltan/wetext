import React, { useEffect, useContext } from "react";
import openSocket from "socket.io-client";
import { activeChatAction } from "./components/stateManagement/actions";
import { store } from "./components/stateManagement/store";
// import { store } from "./stateManagement/store;

const SOCKET_URL = "http://localhost:9000/";
let socket;


const SocketService = () => {
  const {
    state: { userDetail },
    dispatch,
  } = useContext(store);

  const setupSocket = () => {
    socket = openSocket(SOCKET_URL);
    socket.on("command", (data) => {
        // console.log(userDetail);
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);
      if (!user) return;
      if (user.id !== data.receiver) return;
      dispatch({ type: activeChatAction, payload: true });
    });
  };

  useEffect(setupSocket, [userDetail]);

  return <></>;
};

export default SocketService;

const sendSocket = (data) => {
  socket.emit("command", {
    type: data.type,
    id: data.id,
    content: data.content,
  });
};

export const sendTestSocket = (data) => {
  socket.emit("command", data);
};