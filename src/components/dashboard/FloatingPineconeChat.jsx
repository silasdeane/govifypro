import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, AlertCircle } from 'lucide-react';

const FloatingPineconeChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Test the API connection when the chat is opened
  useEffect(() => {
    if (isOpen && !isConnected) {
      // Test the API endpoint
      fetch('/api/hello')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error(`API test failed with status: ${res.status}`);
        })
        .then(data => {
          console.log('API connection successful', data);
          setIsConnected(true);
          setError(null);
        })
        .catch(err => {
          console.error('API connection error:', err);
          setError(`API connection error: ${err.message}`);
        });
    }
  }, [isOpen, isConnected]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
  
    try {
      // Format messages according to Pinecone's expected format
      const pineconeMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  
      // Use relative path to make sure we're hitting the right endpoint
      const apiUrl = '/api/pinecone';
      console.log('Sending message to Pinecone API');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: pineconeMessages,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
  
      const data = await response.json();
      
      // Add the assistant's response to the messages
      if (data.message && data.message.content) {
        setMessages(prevMessages => [
          ...prevMessages, 
          { role: 'assistant', content: data.message.content }
        ]);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error communicating with assistant:', error);
      setError(`Failed to connect: ${error.message}`);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a welcome message when the chat is first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: 'Hello! I\'m the Phoenixville Assistant. How can I help you today?' 
        }
      ]);
    }
  }, [isOpen, messages.length]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all duration-200"
          aria-label="Open chat assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      
      {isOpen && (
        <div className="w-80 sm:w-96 h-96 bg-white rounded-2xl shadow-xl flex flex-col border border-slate-200 overflow-hidden">
          <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-white rounded-full mr-2 animate-pulse"></div>
              <h3 className="font-medium">Phoenixville Assistant</h3>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-indigo-200 transition-colors"
                aria-label="Minimize chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-indigo-200 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-indigo-50/50">
            {error && (
              <div className="flex items-center p-2 mb-2 bg-red-50 text-red-600 rounded-lg text-xs">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white ml-auto'
                      : 'bg-white shadow border border-slate-100'
                  }`}
                >
                  {message.content}
                </div>
              ))}
              {isLoading && (
                <div className="bg-white shadow border border-slate-100 p-3 rounded-lg max-w-[85%] flex items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>
          </div>
          
          <div className="p-3 border-t border-slate-200">
            <form onSubmit={sendMessage} className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-l-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingPineconeChat;