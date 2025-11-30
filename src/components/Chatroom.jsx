import React, { useState } from "react";
/*import "./Chatroom.css";*/
import "../pages/Farmer/Chatroom.css";
import { MdSend } from "react-icons/md";

function Chatroom() {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (input.trim() === "") return;

        setMessages([...messages, { text: input, sender: "You" }]);
        setInput("");
    };

    return (
        <div className="chatroom-page">
            <h2>Chatroom</h2>

            <div className="chat-window">
                {messages.length === 0 && (
                    <p className="no-messages">Start chatting with buyers...</p>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <span className="sender">{msg.sender}:</span>
                        <span>{msg.text}</span>
                    </div>
                ))}
            </div>

            <div className="chat-input-box">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button onClick={sendMessage}>
                    <MdSend />
                </button>
            </div>

        </div>
    );
}

export default Chatroom;
