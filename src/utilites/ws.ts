// const ws = new WebSocket(`wss://chatting-app-1-4lp1.onrender.com`);
const ws = new WebSocket("wss://chatting-app-1-4lp1.onrender.com"); // Use Render's domain


ws.onopen = () => console.log("✅ WebSocket Connected");
ws.onerror = (error) => console.error("❌ WebSocket Error:", error);
ws.onclose = (event) => console.warn("⚠️ WebSocket Disconnected:", event.reason);

// Function to send messages safely
export const sendMessage = (data: any) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    } else {
        console.warn("⚠️ WebSocket is not open. Message not sent.");
    }
};

export default ws;
