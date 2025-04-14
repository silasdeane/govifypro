import React, { useState } from 'react';

function PineconeAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // API configuration
  const PINECONE_HOST = 'https://prod-1-data.ke.pinecone.io';
  const PINECONE_API_KEY = 'csk_1MfLA_QRmNnRSR4pumc7thAYp6eqHkxGF3Jhmbs9X66SN2i1Rr4akBzmERV5NCjyBhE8e'; // Consider using environment variables in production

  // Handle sending messages to Pinecone
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create the conversation history
      const pineconeMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Direct API call to Pinecone (CORS extension will handle the requests)
      const response = await fetch(`${PINECONE_HOST}/assistants/phoenixville/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': PINECONE_API_KEY,
        },
        body: JSON.stringify({
          messages: pineconeMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Pinecone API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Add assistant response to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: data.message.content }
      ]);
    } catch (error) {
      console.error('Error communicating with Pinecone:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pinecone-assistant">
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isLoading && <div className="loading">Loading...</div>}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}

export default PineconeAssistant;