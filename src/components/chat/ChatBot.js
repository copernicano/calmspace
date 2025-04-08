// src/components/chat/ChatBot.js
import React, { useState, useRef, useEffect, useContext } from 'react';
import { sendMessage, getFallbackResponse } from '../../utils/apiService';
import { SettingsContext } from '../../contexts/SettingsContext';
import '../../styles/chatbot.css';

function ChatBot({ onClose }) {
  const { settings } = useContext(SettingsContext);
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState([
    { 
      role: 'assistant', 
      content: 'Ciao, sono qui per aiutarti. Come ti senti oggi?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scorrimento automatico alla fine dei messaggi
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Focus automatico sull'input quando il componente si monta
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!userMessage.trim()) return;
    
    // Aggiungi il messaggio dell'utente alla conversazione
    const newMessage = { role: 'user', content: userMessage };
    setConversation(prevConversation => [...prevConversation, newMessage]);
    
    // Resetta il campo di input
    setUserMessage('');
    
    // Mostra l'indicatore di caricamento
    setIsLoading(true);
    
    try {
      // Chiama l'API
      const response = await sendMessage(userMessage);
      
      // Aggiungi la risposta del bot alla conversazione
      setConversation(prevConversation => [
        ...prevConversation, 
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      // In caso di errore, mostra una risposta predefinita
      console.error("Errore durante l'invio del messaggio:", error);
      setConversation(prevConversation => [
        ...prevConversation, 
        { role: 'assistant', content: getFallbackResponse() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Lista di suggerimenti predefiniti per aiutare l'utente
  const suggestions = [
    "Mi sento ansioso",
    "Come posso calmarmi?",
    "Non riesco a concentrarmi",
    "Mi sento sopraffatto"
  ];

  const handleSuggestionClick = (suggestion) => {
    setUserMessage(suggestion);
    // Focus sull'input dopo aver selezionato un suggerimento
    inputRef.current.focus();
  };

  // Classe del container basata sulle impostazioni
  const containerClass = `chatbot-container theme-${settings.theme} ui-size-${settings.uiSize}`;

  return (
    <div className={containerClass}>
      <div className="chatbot-header">
        <h2 className="chatbot-title">Assistente CalmSpace</h2>
        <button 
          className="close-button" 
          onClick={onClose}
          aria-label="Chiudi"
        >
          ✕
        </button>
      </div>
      
      <div className="messages-container">
        {conversation.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant-message">
            <div className="loading-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="suggestions-container">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-button"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
      
      <form className="input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="message-input"
          ref={inputRef}
          aria-label="Messaggio"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !userMessage.trim()}
          aria-label="Invia"
        >
          <span className="send-icon">➤</span>
        </button>
      </form>
      
      <div className="chatbot-footer">
        <p className="footer-text">
          Questo assistente è qui per supportarti, ma non sostituisce l'aiuto professionale.
        </p>
      </div>
    </div>
  );
}

export default ChatBot;