import React, { useState } from 'react'
import FriendCard from './FriendCard'

function FriendsList() {
  const [friends, setFriends] = useState([])
  const [activeFriend, setActiveFriend] = useState()

  useState(() => {
    let friends = [
      {
        name: "Görkem Ayten",
        mesCount: 2,
        lastMes: "Last"
      },
      {
        name: "Ayberk Yaşa",
        mesCount: 3,
        lastMes: "Message"
      },
      {
        name: "Kaan Özaltan",
        mesCount: 1,
        lastMes: "Son"
      }
    ]
    setFriends(friends)
  }, [])
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
              <FriendCard key={index} name={friend.name} mesCount={friend.mesCount} clickable onClick={() => setActiveFriend(friend)} lastMes={friend.lastMes}></FriendCard>
            ))
          )
        }
      </div>

    </div>
  )
}

export default FriendsList