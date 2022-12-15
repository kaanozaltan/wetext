import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { activeChatAction } from '../stateManagement/actions';
import { store } from '../stateManagement/store';
import { MESSAGES_URL, MESSAGE_URL } from '../utils/urls';

function Chat({ activeFriend }) {
    const [message, setMessage] = useState("")
    const [me, setMe] = useState({});
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null)

    const { state: { activeChat }, dispatch } = useContext(store)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setMe(user)
        getMessages()
    }, [])

    useEffect(() => {
        if (activeChat) {
            getMessages();
            dispatch({ type: activeChatAction, payload: null })
        }
        getMessages()
    }, [activeFriend, activeChat])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const getMessages = () => {
        const token = localStorage.getItem("token")
        var arr = [];

        var result = axios.get(MESSAGES_URL + `?user_id=${activeFriend.id}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        }).then(res => {
            res.data.forEach((item) => {
                var d = new Date(item.created_at);
                var time = d.getHours() + ":" + d.getMinutes();
                let obj = {
                    receiver: item.receiver,
                    content: item.content,
                    time
                }
                arr.push(obj)
            })
            setMessages(arr.reverse())
        }).catch((error) => {
            console.log(error);
        })

        if (result) {
            scrollToBottom()
            setMessages([messages, ...arr]);
        }

    }

    const scrollToBottom = () => {
        setTimeout(() => {
          let chatArea = document.getElementById("chatArea")
          chatArea.scrollTop = chatArea.scrollHeight;
        }, 5)
      }

    const handleScroll = () => {
    }

    const submitMessage = async (e) => {
        var d = new Date();
        var time = d.getHours() + ":" + d.getMinutes();
        e.preventDefault();
        let data = {
            sender_id: me.id,
            receiver_id: activeFriend.id,
            content: message,
            time
        };
        setMessages([...messages, data])
        const token = localStorage.getItem("token")
        var result = axios.post(MESSAGE_URL, data, {
            headers: {
                'Authorization': `Token ${token}`
            }
        }).then(res => {
            // console.log(res);
        }).catch((error) => {
            console.log(error);
        })
        if(result){
            scrollToBottom()
        }
        setMessage("")
    }
    return (
        <div>
            <div className="flex align-center justify-between heading">
                <div className="flex align-center">
                    <div className='friendCard'>
                        <div className="contents">
                            <div className="chatname">{activeFriend.first_name} {activeFriend.last_name}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chatArea" id="chatArea" onScroll={handleScroll}>
                {messages.length < 1 ? (
                    <div className="noMessage">No message yet</div>
                ) : (
                    messages.map((item, key) => (

                        <div key={key} className={`messageBubbleContainer ${item.receiver === me.id ? "" : "sender"}`}>
                            <div className="messageBubble">
                                <p>{item.content}</p>
                                <div className="time">{item.time}</div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef}></div>
            </div>
            <form onSubmit={submitMessage} className="messageZone">
                <input
                    className='typeMes'
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex align-center">
                    <button className='submitButton' type="submit">
                        <FiSend></FiSend>
                    </button>
                </div>

            </form>
        </div>
    )
}

export default Chat