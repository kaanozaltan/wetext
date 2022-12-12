import React from 'react'

function FriendCard(props) {
    let mesCount = 0;
    if (props.mesCount) {
        if (parseInt(props.mesCount) > 0) {
            mesCount = props.mesCount;
        }
    }
    return (
        <div
            className={`flex align-center justify-between friendsMain ${props.clickable ? "clickable" : ""
                }`}
            onClick={() => props.clickable && props.onClick()}
        >
            <div className='friendCard'>
                <div className="contents">
                    <div className="name">{props.name}</div>
                    <div className="subContent">{props.lastMes}</div>
                </div>
            </div>
            {
                mesCount > 0 && <div className="counter">{props.mesCount}</div>
            }

        </div>
    )
}

export default FriendCard