import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FRIENDS_URL } from '../utils/urls'
import FriendCard from './FriendCard'

function FriendsList({selectFriend}) {
  const [friends, setFriends] = useState([])
  const [activeFriend, setActiveFriend] = useState()

  useState(() => {
    // let friends = [
    //   {
    //     name: "Görkem Ayten",
    //     mesCount: 2,
    //     lastMes: "Last"
    //   },
    //   {
    //     name: "Ayberk Yaşa",
    //     mesCount: 3,
    //     lastMes: "Message"
    //   },
    //   {
    //     name: "Kaan Özaltan",
    //     mesCount: 1,
    //     lastMes: "Son"
    //   }
    // ]
    const token = localStorage.getItem("token");
    axios.get(FRIENDS_URL, {
      headers: {
        'Authorization': `Token ${token}`
      }
    }).then((res) => {
      const me = JSON.parse(localStorage.getItem("user"));
      console.log(me);
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

  // const selectFriend = (friend) => {
  //   console.log(friend);
  // }

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