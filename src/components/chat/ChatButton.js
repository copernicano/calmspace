// src/components/chat/ChatButton.js
import React, { useState } from 'react';
import ChatBot from './ChatBot';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import '../../styles/chatbot.css';

function ChatButton({ emotion, intensity, currentPage }) {
  const { settings } = useEnhancedSettings();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Non mostrare se l'assistente è esplicitamente disabilitato (default: true)
  const isEnabled = settings.aiAssistant?.enabled ?? true;
  if (!isEnabled) {
    return null;
  }

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

      {/* Componente ChatBot con contesto */}
      {isChatOpen && (
        <ChatBot
          onClose={() => setIsChatOpen(false)}
          emotion={emotion}
          intensity={intensity}
          currentPage={currentPage}
        />
      )}
    </>
  );
}

export default ChatButton;
