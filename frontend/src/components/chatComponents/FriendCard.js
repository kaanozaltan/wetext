import React from 'react'

function FriendCard({ friend, selectFriend }) {
    return (
        <div
            className={`flex align-center justify-between friendsMain clickable
                }`}
            onClick={() => selectFriend(friend)}
        >
            <div className='friendCard'>
                <div className="contents">
                    <div className="name">{friend.first_name} {friend.last_name}</div>
                </div>
            </div>
            {/* {
                mesCount > 0 && <div className="counter">{props.mesCount}</div>
            } */}

        </div>
    )
}

export default FriendCard