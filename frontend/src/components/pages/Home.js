/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useContext } from "react";
import { MdLogout } from "react-icons/md";
import { logout } from "../authController";
import Chat from "../chatComponents/Chat";
import FriendsList from "../chatComponents/FriendsList";
import { activeChatUserAction } from "../stateManagement/actions";
import { store } from "../stateManagement/store";

const Home = (props) => {
  const [userdetail, setUserDetail] = useState(null);
  const [activeFriend, setActiveFriend] = useState(null);
  const [me, setMe] = useState({})

  const { dispatch } = useContext(store)

  useEffect(() => {
    const me = JSON.parse(localStorage.getItem("user"));
    setMe(me)
  }, [])

  const selectFriend = (friend) => {
    setActiveFriend(friend)
    localStorage.setItem('activeFriend', JSON.stringify(friend));
    dispatch({ type: activeChatUserAction, payload: friend })
  }

  return (
    <>
      <div className="home-container">
        <div className="side close" id="sideBar">
          <div className="flex align-center justify-center top">
            <div className="contents">
              <div className="username">{`${me.first_name} ${me.last_name}`}</div>
              {/* {!props.noStatus && <div className="subContent">{props.caption}</div>} */}
            </div>
          </div>
          <hr />
          <FriendsList selectFriend={selectFriend}></FriendsList>
          <button className="logout" onClick={() => logout(props)}>
            <MdLogout></MdLogout>
            <div>Logout</div>
          </button>
        </div>
        <div className="main">
          {activeFriend ? (
            <Chat activeFriend={activeFriend} loggedUser={userdetail} />
          ) : (
            <div>
              <div className="noFriend">Click on a user to start chatting</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;