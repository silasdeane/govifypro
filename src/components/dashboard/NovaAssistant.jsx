import React, { useState, useEffect, useRef } from 'react';
import './NovaAssistant.css';
import { generateSuggestedQuestions } from '/Users/heysilas/GovifyPro/nova-dashboard/src/utils/questionSuggestions.js';
import { saveMessageToHistory, getPreviousQuestions, clearMessageHistory } from '/Users/heysilas/GovifyPro/nova-dashboard/src/utils/messageHistory.js';

const NovaAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSources, setExpandedSources] = useState({});
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    "Who is the mayor?",
    "What are the office hours?",
    "How do I pay my water bill?",
    "When is trash collection?"
  ]);
  
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
    
    // Add a demo message
    setMessages([
      { 
        role: 'assistant', 
        content: 'Hello! I\'m Nova Assistant. How can I help you with Phoenixville municipal information today?'
      }
    ]);
  }, []);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkApiStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/status');
      const data = await response.json();
      setApiStatus(data);
    } catch (err) {
      setApiStatus({ status: 'error', message: 'Cannot connect to API' });
      setError('Cannot connect to the Nova Assistant API. Please check if the server is running.');
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleSources = (messageIndex) => {
    setExpandedSources(prev => ({
      ...prev,
      [messageIndex]: !prev[messageIndex]
    }));
  };

  const handleSuggestedQuestionClick = (question) => {
    setInput(question);
    handleSubmit(null, question);
  };

  const handleClearHistory = () => {
    // Clear chat messages
    setMessages([
      { 
        role: 'assistant', 
        content: 'Hello! I\'m Nova Assistant. How can I help you with Phoenixville municipal information today?'
      }
    ]);
    
    // Clear history from local storage
    clearMessageHistory();
    
    // Reset suggestions
    setSuggestedQuestions([
      "Who is the mayor?",
      "What are the office hours?",
      "How do I pay my water bill?",
      "When is trash collection?"
    ]);
  };

  const handleSubmit = async (e, suggestedQuestion = null) => {
    if (e) e.preventDefault();
    
    const queryText = suggestedQuestion || input;
    if (!queryText.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: queryText };
    setMessages(prev => [...prev, userMessage]);
    
    // Save to history
    saveMessageToHistory(userMessage);
    
    // Clear input and show loading state
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Send query to API
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.content,
          context: 'general' // You can change this or make it selectable
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from API');
      }
      
      const data = await response.json();
      
      // Get previous questions and generate suggestions
      const previousQuestions = getPreviousQuestions();
      const newSuggestions = generateSuggestedQuestions(data.result, previousQuestions);
      setSuggestedQuestions(newSuggestions);
      
      // Add assistant response to chat
      const assistantResponse = {
        role: 'assistant',
        content: data.result,
        sourceDocs: data.source_documents,
        processTime: data.processing_time
      };
      
      setMessages(prev => [...prev, assistantResponse]);
      
      // Save assistant response to history too
      saveMessageToHistory(assistantResponse);
      
    } catch (err) {
      console.error('Error querying API:', err);
      setError('Error connecting to the assistant. Please try again later.');
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m sorry, I encountered an error processing your request. Please try again later.',
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Component for displaying message sources with improved UI
  const MessageSources = ({ sources, messageIndex, expanded, toggleExpand }) => {
    // Count unique sources to display a better count
    const uniqueSources = sources ? 
      [...new Set(sources.map(doc => doc.source))] : [];
    
    // Check if all sources are from the same type (e.g., Historical Review Board)
    const allSameSource = uniqueSources.length === 1 && 
      sources.length > 1 && 
      sources.every(doc => doc.source === sources[0].source);
    
    // Determine if we need to show additional context about source quality
    const lowQualityMatch = sources && sources.some(doc => 
      doc.score !== undefined && doc.score < 0.2);
    
    return (
      <div className="message-sources">
        <button 
          className="sources-toggle" 
          onClick={() => toggleExpand(messageIndex)}
          aria-expanded={expanded}
        >
          <span className="sources-icon">
            {expanded ? '▼' : '►'} 
          </span>
          {allSameSource ? (
            <span>Source: {uniqueSources[0].split(" (")[0]} ({sources.length} sections)</span>
          ) : (
            <span>Sources ({uniqueSources.length})</span>
          )}
        </button>
        
        {expanded && (
          <div className="sources-content">
            {lowQualityMatch && (
              <div className="source-quality-note">
                Note: The matching confidence for these sources is low. The answer may be limited.
              </div>
            )}
            <ul className="sources-list">
              {sources.map((doc, docIndex) => (
                <li key={docIndex}>
                  <span className="source-name">
                    {doc.source}
                    {doc.score !== undefined && (
                      <span className="source-score">
                        {" "}(relevance: {Math.max(1, (doc.score * 100)).toFixed(1)}%)
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`nova-floating-assistant ${isOpen ? 'open' : 'closed'}`}>
      {/* Toggle button */}
      <button 
        className="nova-toggle-button"
        onClick={toggleChat}
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        {isOpen ? (
          <span>×</span>
        ) : (
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {apiStatus && apiStatus.status === 'ok' && (
              <span className="nova-status-dot online"></span>
            )}
            {apiStatus && apiStatus.status !== 'ok' && (
              <span className="nova-status-dot offline"></span>
            )}
          </span>
        )}
      </button>
      
      {/* Chat window */}
      <div className="nova-chat-window">
        <div className="nova-chat-header">
          <h3>Nova Assistant</h3>
          <div className="nova-assistant-status">
            {apiStatus ? (
              apiStatus.status === 'ok' ? (
                <span className="status-badge online">Online</span>
              ) : (
                <span className="status-badge offline">Offline</span>
              )
            ) : (
              <span className="status-badge checking">Checking...</span>
            )}
            <button 
              className="clear-history-button" 
              onClick={handleClearHistory}
              title="Clear chat history"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {error && <div className="nova-assistant-error">{error}</div>}
        
        <div className="nova-chat-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'} ${message.error ? 'error-message' : ''}`}
            >
              <div className="message-content">{message.content}</div>
              
              {message.sourceDocs && message.sourceDocs.length > 0 && (
                <MessageSources 
                  sources={message.sourceDocs}
                  messageIndex={index}
                  expanded={expandedSources[index]}
                  toggleExpand={toggleSources}
                />
              )}
              
              {message.processTime && (
                <div className="message-time">
                  Response time: {message.processTime.toFixed(2)}s
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggested Questions */}
        {messages.length > 0 && suggestedQuestions.length > 0 && (
          <div className="suggested-questions">
            <div className="suggestions-label">Try asking:</div>
            <div className="suggestions-list">
              {suggestedQuestions.map((question, index) => (
                <button 
                  key={index}
                  className="suggestion-button"
                  onClick={() => handleSuggestedQuestionClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form className="nova-chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me about municipal services..."
            disabled={isLoading}
            ref={chatInputRef}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NovaAssistant;