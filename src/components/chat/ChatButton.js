// src/components/chat/ChatButton.js
import React, { useState } from 'react';
import ChatBot from './ChatBot';
import '../../styles/chatbot.css';

function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Pulsante fisso per aprire la chat */}
      <button 
        className={`chat-button ${isChatOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label="Assistente"
      >
        <span className="chat-icon">💬</span>
        <span className="chat-label">Assistente</span>
      </button>

      {/* Componente ChatBot */}
      {isChatOpen && <ChatBot onClose={() => setIsChatOpen(false)} />}
    </>
  );
}

export default ChatButton;