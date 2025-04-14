import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, MessageCircle, Send, X, AlertCircle, Info, 
  CheckCircle, FileText, User, Users, Grid, Clock
} from 'lucide-react';

// Nova AI Assistant component for Govify
export default function NovaAssistant({ context = 'people' }) {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Message types and their styling
  const messageTypes = {
    critical: {
      icon: <AlertTriangle className="w-5 h-5" />,
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-700"
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700"
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      text: "text-indigo-700"
    },
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700"
    },
    neutral: {
      icon: <Info className="w-5 h-5" />,
      bg: "bg-white",
      border: "border-slate-100",
      text: "text-slate-700"
    },
    user: {
      icon: <User className="w-5 h-5" />,
      bg: "bg-indigo-600",
      text: "text-white"
    }
  };

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Initial messages for the people context
  useEffect(() => {
    // Demo messages that would come from the Nova AI
    if (context === 'people') {
      setMessages([
        {
          type: "info",
          content: "I've analyzed your people data. There are 24,387 constituents and 346 staff members in the system. How can I assist you today?",
          time: "Just now",
          sender: "nova"
        },
        {
          type: "warning",
          content: "There are 15 constituents flagged for housing assistance who haven't been contacted in over 30 days. Would you like me to prepare a report or assign these cases to available staff?",
          time: "Just now",
          actionable: true,
          actions: [
            { label: "Generate Report", value: "report" },
            { label: "Assign Cases", value: "assign" }
          ],
          sender: "nova"
        }
      ]);
    }
  }, [context]);
  
  // Send a new message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newMessage = {
      type: "user",
      content: inputMessage,
      time: "Just now",
      sender: "user"
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Simulate Nova AI response
    setIsTyping(true);
    setTimeout(() => {
      let responseType = "info";
      let responseContent = "I'm analyzing your request about the people in your system. Can you provide more details about what you're looking for?";
      
      // Basic keyword matching for demo purposes
      if (inputMessage.toLowerCase().includes("housing")) {
        responseType = "info";
        responseContent = "I've identified 87 constituents currently seeking housing assistance. 42 are in the application process, 31 are awaiting verification, and 14 are ready for placement. Would you like me to analyze housing availability in each district?";
      } else if (inputMessage.toLowerCase().includes("staff") && inputMessage.toLowerCase().includes("performance")) {
        responseType = "success";
        responseContent = "Staff performance is trending upward across departments. Parks & Recreation has shown the most improvement (+12%), while Technology department may require attention (-4%). I can provide detailed reports for any department.";
      } else if (inputMessage.toLowerCase().includes("engagement")) {
        responseType = "info";
        responseContent = "Constituent engagement has increased 8% this quarter. The downtown development forum had the highest participation (378 attendees). I recommend focusing on the southern district where engagement is lowest. Should I draft an outreach plan?";
      }
      
      const novaResponse = {
        type: responseType,
        content: responseContent,
        time: "Just now",
        sender: "nova"
      };
      
      setMessages(prev => [...prev, novaResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle action button clicks
  const handleActionClick = (action) => {
    // Simulate Nova AI response to an action
    setIsTyping(true);
    setTimeout(() => {
      let responseContent = "";
      let responseType = "info";
      
      if (action === "report") {
        responseType = "success";
        responseContent = "I've generated a comprehensive report on the housing assistance cases. The report has been saved to your documents and includes contact details, case history, and priority levels for each constituent. Would you like me to share this with the housing department team?";
      } else if (action === "assign") {
        responseType = "success";
        responseContent = "I've assigned the 15 housing assistance cases to available staff members based on current workload and specialization. Sarah Kim has been assigned 7 cases, Michael Washington 5 cases, and Jennifer Martinez 3 cases. Would you like to review these assignments?";
      }
      
      const novaResponse = {
        type: responseType,
        content: responseContent,
        time: "Just now",
        sender: "nova"
      };
      
      setMessages(prev => [...prev, novaResponse]);
      setIsTyping(false);
    }, 1000);
  };
  
  return (
    <div className={`fixed bottom-4 right-4 flex flex-col bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-300 ${isExpanded ? 'w-[450px] h-[600px]' : 'w-16 h-16 rounded-xl'}`}>
      {/* Header */}
      <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between">
        {isExpanded ? (
          <>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center mr-2">
                <div className="w-5 h-5 rounded-full bg-white"></div>
              </div>
              <h3 className="font-semibold text-white text-lg">Nova AI Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={() => setIsExpanded(true)}
            className="w-full h-full flex items-center justify-center bg-indigo-600"
          >
            <div className="relative w-10 h-10 bg-indigo-600 rounded-md flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </button>
        )}
      </div>
      
      {isExpanded && (
        <>
          {/* Context Selector */}
          <div className="px-4 py-3 border-b border-slate-100 flex space-x-2">
            {[
              { id: 'people', label: 'People', icon: <Users className="w-4 h-4" /> },
              { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
              { id: 'departments', label: 'Departments', icon: <Grid className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                className={`px-4 py-2 text-sm rounded-full flex items-center transition-colors ${
                  context === item.id 
                    ? 'bg-indigo-100 text-indigo-700 font-medium' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </button>
            ))}
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => {
              const style = messageTypes[msg.type];
              
              if (msg.sender === 'user') {
                return (
                  <div key={index} className="flex justify-end">
                    <div className="max-w-[80%] rounded-lg px-4 py-3 bg-indigo-600 text-white">
                      {msg.content}
                    </div>
                  </div>
                );
              }
              
              return (
                <div 
                  key={index} 
                  className={`${style.bg} ${style.text} p-4 rounded-lg flex items-start shadow-sm border ${style.border}`}
                >
                  <div className="mr-3 mt-0.5 flex-shrink-0">
                    {style.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-base">
                      {msg.content}
                    </div>
                    
                    {msg.actionable && msg.actions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => handleActionClick(action.value)}
                            className={`px-4 py-2 rounded-md font-medium shadow-sm transition-colors ${
                              action.primary 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                                : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs opacity-60">
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-500 p-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
                </div>
                <span>Nova is typing...</span>
              </div>
            )}
            
            {/* Invisible element to allow scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="px-4 py-4 border-t border-slate-100">
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Nova anything..."
                className="w-full pl-5 pr-12 py-3 border border-slate-200 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-slate-800"
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-800"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Suggested Queries */}
      {/*    <div className="px-4 py-3 border-t border-slate-100">
            <div className="text-sm text-slate-500 mb-3">Suggested queries:</div>
            <div className="flex flex-wrap gap-2">
              {[
                "Show housing assistance cases",
                "Staff performance report",
                "Engagement trends",
                "Recent constituent complaints"
              ].map((query, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(query);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  {query}
                </button>
              ))}
                </div> 
          </div>*/}
        </> 
      )}
    </div>
  );
}