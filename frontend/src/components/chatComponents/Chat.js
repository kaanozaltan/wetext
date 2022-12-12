import React, { useState } from 'react'
import { FiSend } from 'react-icons/fi'

function Chat({ activeFriend }) {
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([
        {
            message: "Selam",
            time: "13.40"
        },
        {
            message: "Naber",
            time: "13.40"
        },
        {
            message: "Nasılsın",
            time: "13.40"
        },
        {
            message: "Napıyorsun",
            time: "13.40"
        },
    ])
    const handleScroll = () => {
        console.log("handle scroll");
    }

    const submitMessage = async (e) => {
        e.preventDefault();
        console.log('submit message');
    }
    return (
        <div>
            <div className="flex align-center justify-between heading">
                <div className="flex align-center">
                    <div className='friendCard'>
                        <div className="contents">
                            <div className="name">{activeFriend.name}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chatArea" id="chatArea" onScroll={handleScroll}>
                {messages.length < 1 ? (
                    <div className="noMessage">No message yet</div>
                ) : (
                    messages.map((item, key) => (
                        <div className={`messageBubbleContainer sender`}>
                            <div className="messageBubble">
                                <p>{item.message}</p>
                                <div className="time">{item.time}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={submitMessage} className="messageZone">
                <div className="flex align-center justify-between topPart">
                    <div />
                    <button type="submit">
                        <FiSend></FiSend>
                    </button>
                </div>
                <input
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </form>
        </div>
    )
}

export default Chat