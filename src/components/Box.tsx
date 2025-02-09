import { useState, useEffect } from "react";
import "./Box.css";
import ws, { sendMessage } from "../utilites/ws";
import ChatBox from "./ChatBox";

function Box() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join" | null>(null);
  const [isRoomActive, setIsRoomActive] = useState(false); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ws.onmessage = (event: { data: string }) => {
      const data = JSON.parse(event.data);
      if (data.type === "room-created") {
        setCreatedRoomId(data.roomId);
        setRoomId(data.roomId);
        startLoading(() => setIsRoomActive(true));
      } else if (data.type === "room-joined") {
        startLoading(() => setIsRoomActive(true));
      }
    };
  }, []);

  const startLoading = (callback: () => void) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      callback();
    }, 2000);
  };

  const handleCreateRoom = () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    sendMessage({ type: "create-room", username });
    setActiveTab("create");
    setLoading(true);
  };

  const handleJoinRoom = () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    setActiveTab("join");
  };

  const handleConfirmJoinRoom = () => {
    if (!roomId.trim()) {
      alert("Please enter a Room ID");
      return;
    }
    sendMessage({ type: "join-room", roomId, username });
    setLoading(true);
  };

  if (isRoomActive) {
    return <ChatBox username={username} roomId={roomId} />;
  }

  return (
    <div className="container">
      <div className="box">
        {loading && <div className="loader"></div>}
        {!activeTab && !loading && (
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        {!activeTab && !loading && (
          <div className="button-group">
            <button className="toggle-btn" onClick={handleCreateRoom} disabled={loading}>
              Create Room
            </button>
            <button className="toggle-btn" onClick={handleJoinRoom} disabled={loading}>
              Join Room
            </button>
          </div>
        )}

        {activeTab === "create" && !loading && (
          <div className="section">
            <p className="info">
              Room Created: <strong>{createdRoomId}</strong>
            </p>
          </div>
        )}

        {activeTab === "join" && !loading && (
          <div className="section">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <button className="submit-btn" onClick={handleConfirmJoinRoom} disabled={loading}>
              Join Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Box;
