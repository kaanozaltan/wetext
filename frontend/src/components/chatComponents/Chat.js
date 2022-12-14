import { type } from '@testing-library/user-event/dist/type';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { sendTestSocket } from '../../socketService';
import { axiosHandler, getToken } from '../helper';
import { activeChatAction } from '../stateManagement/actions';
import { store } from '../stateManagement/store';
import { MESSAGES_URL, MESSAGE_URL } from '../utils/urls';

function Chat({ activeFriend }) {
    const [message, setMessage] = useState("")
    const [me, setMe] = useState({});
    const [messages, setMessages] = useState([]);

    const {state:{activeChat}, dispatch} = useContext(store)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        // console.log(user);
        setMe(user)
        getMessages()
    }, [])

    useEffect(() => {
        if(activeChat){
            getMessages();
            dispatch({type: activeChatAction, payload:null})
        }
        getMessages()
    }, [activeChat])

    useEffect(() => {
        console.log(messages);
    }, [messages])

    const getMessages = () => {
        const token = localStorage.getItem("token")
        var arr = [];

        var result = axios.get(MESSAGES_URL + `?user_id=${activeFriend.id}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        }).then(res => {
            console.log(res);
            // setMessages(res)
            res.data.forEach((item) => {
                let obj = {
                    receiver: item.receiver,
                    content: item.content,
                }
                arr.push(obj)
            })
            // console.log(arr);
            setMessages(arr.reverse())
        }).catch((error) => {
            console.log(error);
        })

        if(result){
            setMessages([messages, ...arr]);
        }

    }

    const handleScroll = () => {
        console.log("handle scroll");
    }

    const submitMessage = async (e) => {
        e.preventDefault();
        let data = {
            sender_id: me.id,
            receiver_id: activeFriend.id,
            content: message,
        };
        setMessages([...messages, data])
        const token = localStorage.getItem("token")
        var result = axios.post(MESSAGE_URL, data, {
            headers: {
                'Authorization': `Token ${token}`
            }
        }).then(res => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        })
        // sendTestSocket(data)
        setMessage("")
        // console.log(result);
        console.log('submit message');
    }
    return (
        <div>
            <div className="flex align-center justify-between heading">
                <div className="flex align-center">
                    <div className='friendCard'>
                        <div className="contents">
                            <div className="name">{activeFriend.first_name} {activeFriend.last_name}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chatArea" id="chatArea" onScroll={handleScroll}>
                {messages.length < 1 ? (
                    <div className="noMessage">No message yet</div>
                ) : (
                    messages.map((item, key) => (
                        
                        <div className={`messageBubbleContainer ${item.receiver === me.id ? "" : "sender"}`}>
                            <div className="messageBubble">
                                <p>{item.content}</p>
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