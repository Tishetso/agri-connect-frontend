import React, { useState } from 'react';
import './ConsumerChatroom.css';

function ConsumerChatroom() {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Farmer Thabo', text: 'Fresh tomatoes available today!', time: '10:30 AM', type: 'farmer' },
        { id: 2, sender: 'You', text: 'Do you have organic options?', time: '10:32 AM', type: 'consumer' },
        { id: 3, sender: 'Farmer Thabo', text: 'Yes, all our produce is organic certified.', time: '10:33 AM', type: 'farmer' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            const message = {
                id: messages.length + 1,
                sender: 'You',
                text: newMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'consumer'
            };
            setMessages([...messages, message]);
            setNewMessage('');
        }
    };

    return (
        <div className="consumer-chatroom">
            <header className="page-header">
                <h2>💬 Chatroom</h2>
                <p>Connect with farmers and other consumers</p>
            </header>

            <div className="chatroom-container">
                <aside className="chat-list">
                    <h3>Conversations</h3>
                    <ul>
                        <li className="chat-item active">
                            <div className="chat-avatar">FT</div>
                            <div className="chat-info">
                                <h4>Farmer Thabo</h4>
                                <p>Yes, all our produce is organic...</p>
                            </div>
                        </li>
                        <li className="chat-item">
                            <div className="chat-avatar">FN</div>
                            <div className="chat-info">
                                <h4>Farmer Naledi</h4>
                                <p>Order confirmed!</p>
                            </div>
                        </li>
                        <li className="chat-item">
                            <div className="chat-avatar">GZ</div>
                            <div className="chat-info">
                                <h4>Gardener Zanele</h4>
                                <p>Thanks for the tip!</p>
                            </div>
                        </li>
                    </ul>
                </aside>

                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-avatar">FT</div>
                        <div>
                            <h3>Farmer Thabo</h3>
                            <span className="status">Active now</span>
                        </div>
                    </div>

                    <div className="messages-container">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.type}`}>
                                <div className="message-content">
                                    <strong>{msg.sender}</strong>
                                    <p>{msg.text}</p>
                                    <span className="message-time">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form className="message-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="message-input"
                        />
                        <button type="submit" className="send-button">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ConsumerChatroom;