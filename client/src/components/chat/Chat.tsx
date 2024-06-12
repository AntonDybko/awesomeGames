import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router'
import {io, Socket} from 'socket.io-client';
import { random } from '../../utils/utils'
//import { socket } from 'socket';
import useAuth from "hooks/useAuth";
import './Chat.scss';


interface ChatMessage {
    username: string,
    content: string
}

interface Props {
    room: string,
    socket: Socket | null;
}

const Chat: React.FC<Props> = ({ room, socket }) => {
    const { auth } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        socket?.on('chatMessage', (chatMessage: ChatMessage) => {
            setMessages((prevMessages) => [...prevMessages, chatMessage])
        });
    }, [socket])

    useEffect(() => {
        scrollToBottom();
      }, [messages]);

    const sendMessage = () => {
        socket?.emit('chatMessage', { room, username: auth.username, content: inputMessage })
        setInputMessage('')
    }

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }

    return (
        <div className="chat-container">
            <div className='messages-container'>
                <div className='messages'>
                    {messages.map((message, index) => (
                    <div key={index} className='message'>
                        <strong>{message.username}: </strong> {message.content}
                    </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className='input-container'>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className='input-message'
                />
                <button onClick={sendMessage} className='send-button'>Send</button>
            </div>
        </div>
    );
};

export default Chat;