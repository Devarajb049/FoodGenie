import React, { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    { sender: "assistant", text: "Hello! I am your **Food Genie Assistant** 🧞‍♂️. How can I help you satisfy your cravings today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");
    
    // Add to history
    setHistory((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post("/v1/ai/chatbot", {
        message: userMessage,
        history: history
      });
      setHistory((prev) => [...prev, { sender: "assistant", text: data.reply }]);
    } catch (err) {
      toast.error("Failed to connect to Food Genie.");
      setHistory((prev) => [...prev, { sender: "assistant", text: "Sorry, I am facing connectivity issues. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setHistory([
      { sender: "assistant", text: "Hello! I am your **Food Genie Assistant** 🧞‍♂️. How can I help you satisfy your cravings today?" }
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
          color: "white",
          border: "none",
          boxShadow: "0 8px 24px rgba(255, 87, 34, 0.3)",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.6rem",
          transition: "transform 0.2s ease"
        }}
        className="hover-scale"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "105px",
            right: "30px",
            width: "350px",
            height: "500px",
            background: "#FFFFFF",
            borderRadius: "20px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9998
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
              color: "white",
              display: "flex",
              justifyContent: "between",
              alignItems: "center"
            }}
          >
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <span style={{ fontSize: "1.4rem" }}>🧞‍♂️</span>
              <div>
                <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "700" }}>Food Genie AI</h4>
                <span style={{ fontSize: "0.7rem", opacity: 0.9 }}>Your friendly food helper</span>
              </div>
            </div>
            <button 
              onClick={clearChat} 
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "15px",
                color: "white",
                fontSize: "0.75rem",
                padding: "4px 10px",
                cursor: "pointer",
                marginLeft: "auto"
              }}
            >
              Clear
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              background: "#F9FAFB",
              display: "flex",
              flexDirection: "column",
              gap: "14px"
            }}
          >
            {history.map((h, idx) => {
              const isUser = h.sender === "user";
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    background: isUser ? "#FF5722" : "#FFFFFF",
                    color: isUser ? "#FFFFFF" : "#374151",
                    padding: "10px 14px",
                    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    boxShadow: isUser ? "0 2px 8px rgba(255, 87, 34, 0.15)" : "0 2px 8px rgba(0, 0, 0, 0.03)",
                    border: isUser ? "none" : "1px solid #E5E7EB",
                    fontSize: "0.82rem",
                    lineHeight: "1.4",
                    wordBreak: "break-word"
                  }}
                >
                  {h.text}
                </div>
              );
            })}
            
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#FFFFFF",
                  padding: "10px 14px",
                  borderRadius: "16px 16px 16px 4px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                  border: "1px solid #E5E7EB",
                  fontSize: "0.82rem",
                  color: "#9CA3AF"
                }}
              >
                Genie is thinking... 🧞‍♂️
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            style={{
              padding: "12px 16px",
              background: "#FFFFFF",
              borderTop: "1px solid #E5E7EB",
              display: "flex",
              gap: "8px"
            }}
          >
            <input
              type="text"
              placeholder="Ask FoodGenie..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                flex: 1,
                border: "1.5px solid #E5E7EB",
                borderRadius: "30px",
                padding: "8px 16px",
                fontSize: "0.85rem",
                outline: "none"
              }}
            />
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #FF7043 0%, #FF5722 100%)",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(255, 87, 34, 0.2)"
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
