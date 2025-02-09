import { useState, useEffect } from "react";
import "./ChatBox.css";
import ws, { sendMessage } from "../utilites/ws";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

function ChatBox({ username, roomId }: { username: string; roomId: string }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ username: string; text: string }[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        event.target instanceof HTMLElement &&
        !event.target.closest(".emoji-picker") &&
        !event.target.closest(".emoji-btn")
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);

        if (data.type === "message") { 
          setMessages((prev) => [...prev, { username: data.from, text: data.msg }]);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onmessage = handleMessage;

    return () => {
      ws.onmessage = null;
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const msgData = { type: "message", roomId, username, msg: message };
    console.log("Sending message:", msgData);

    sendMessage(msgData);
    setMessage("");
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      showToast("Room ID copied! ✅");
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast("Failed to copy ❌");
    }
  };

  const showToast = (msg: string) => {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.className = "toast";
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 2000);
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <p className="RoomId">
          Room ID: {roomId}{" "}
          <span className="copy-icon" onClick={copyRoomId}>📋</span>
        </p>

        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.username === username ? "self" : "other"}`}>
              <div className="message-bubble">
                <strong>{msg.username}</strong>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="input-area relative">
          {/* Emoji Picker Button */}
          <button className="emoji-btn" onClick={() => setShowEmojiPicker((prev) => !prev)}>
            😀
          </button>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="emoji-picker">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;