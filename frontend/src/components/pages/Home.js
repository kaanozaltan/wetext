/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { MdLogout } from "react-icons/md";
import Chat from "../chatComponents/Chat";
import FriendsList from "../chatComponents/FriendsList";

const Home = (props) => {
  const [userdetail, setUserDetail] = useState(null);
  const [activeFriend, setActiveFriend] = useState(null);

  const logout = () => {
    console.log('logout');
    window.location.href = "/login";
  }

  useEffect(() => {
    let activeFriend = {
      name: "Görkem Ayten"
    }
    setActiveFriend(activeFriend)
  }, [])

  return (
    <>
      <div className="home-container">
        <div className="side close" id="sideBar">
          <div className="flex align-center justify-center top">
            <div className="contents">
              <div className="username">fatihkaplama</div>
              {/* {!props.noStatus && <div className="subContent">{props.caption}</div>} */}
            </div>
          </div>
          <hr />
          <FriendsList></FriendsList>
          <button className="logout" onClick={() => logout()}>
            <MdLogout></MdLogout>
            <div>Logout</div>
          </button>
        </div>
        <div className="main">
          {activeFriend ? (
            <Chat activeFriend={activeFriend} loggedUser={userdetail}/>
          ) : (
            <div>
              <div className="noUser">Click on a user to start chatting</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;