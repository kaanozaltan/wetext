import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FRIENDS_URL } from '../utils/urls'
import FriendCard from './FriendCard'

function FriendsList({selectFriend}) {
  const [friends, setFriends] = useState([])
  const [activeFriend, setActiveFriend] = useState()

  useState(() => {
    const token = localStorage.getItem("token");
    axios.get(FRIENDS_URL, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then((res) => {
      const me = JSON.parse(localStorage.getItem("user"));
      const newFriend = res.data.filter((friend) => {
        return (
          friend.id !== me.id
        )
      })
      setFriends(newFriend)
    }).catch((error) => {
      console.log(error);
    })
    // setFriends(friends)
  }, [])

  useEffect(() => {
    // console.log(friends);
  }, [friends])

  const handleScroll = () => {
    console.log("scroll");
  }

  return (
    <div>
      {/* <SearchBar></SearchBar> */}
      <div className='friendsList' onScroll={handleScroll}>
        {
          friends.length < 1 ? (
            <div className="noFriend">You don't have any user to chat with.</div>
          ) : (
            friends.map((friend, index) => (
              <FriendCard key={index} friend={friend} selectFriend={selectFriend}></FriendCard>
            ))
          )
        }
      </div>

    </div>
  )
}

export default FriendsList