import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, AlertCircle } from 'lucide-react';

const FloatingPineconeChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messageEndRef = useRef(null);
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle sending messages to Pinecone via our API proxy
  const sendMessage = async (e) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
  
    try {
      // Create the conversation history
      const pineconeMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  
      // Use the proxy API endpoint instead of direct Pinecone call
      const response = await fetch('/api/pinecone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: pineconeMessages,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Add assistant response to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: data.message.content }
      ]);
    } catch (error) {
      console.error('Error communicating with assistant:', error);
      setError('Failed to connect to the assistant. Please try again later.');
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of your component remains the same
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all duration-200"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      
      {/* Rest of your JSX */}
      {/* ... */}
    </div>
  );
};

export default FloatingPineconeChat;