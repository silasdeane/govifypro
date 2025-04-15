import { useState, useEffect } from 'react';
import { 
  AlertTriangle, Bell, Search, User, Home, Folder, Users, Calendar,
  MessageSquare, BarChart3, Activity, Shield, Lock, Send, Plus, Grid, 
  MessageCircle, ChevronDown, X, AlertCircle, Info, CheckCircle,
  ExternalLink, PenTool, FileText, Database, CalendarDays, Truck, Building,
  Zap, Command, Menu, Settings, Filter, MoreHorizontal, ArrowUp, ArrowDown
} from 'lucide-react';

export default function GovifyNEW() {
  const [searchInput, setSearchInput] = useState("");
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  // Message categories and their styling for Nova AI
  const messageTypes = {
    critical: {
      icon: <AlertTriangle className="w-4 h-4" />,
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-700"
    },
    warning: {
      icon: <AlertCircle className="w-4 h-4" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700"
    },
    info: {
      icon: <Info className="w-4 h-4" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700"
    },
    success: {
      icon: <CheckCircle className="w-4 h-4" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700"
    },
    neutral: {
      icon: <Info className="w-4 h-4" />,
      bg: "bg-slate-50",
      border: "border-slate-100",
      text: "text-slate-700"
    }
  };
  
  // Priority alerts data
  const priorityAlerts = [
    {
      type: "critical",
      title: "Flood warning for Eastside Ward",
      content: "Emergency services on standby. Evacuation routes prepared. Click for response plan activation.",
      time: "10 mins ago",
      actionLabel: "Activate Plan",
      action: () => console.log("Activating emergency plan")
    },
    {
      type: "warning",
      title: "Budget underspend in Parks Department",
      content: "32% underspent for Q2. Funds can be reallocated to pending projects before end of fiscal year.",
      time: "30 mins ago",
      actionLabel: "Reallocate",
      action: () => console.log("Review reallocation options")
    },
    {
      type: "info",
      title: "Engagement up 28% this week",
      content: "Significant increase in community feedback, primarily regarding the new recycling program.",
      time: "2 hrs ago",
      actionLabel: "View Insights",
      action: () => console.log("See what's working")
    }
  ];
  
  // Nova AI chat messages
  const novaMessages = [
    {
      sender: "nova",
      content: "Good morning Mayor! Your city is operating at 82% efficiency today. There's one critical alert about the flood warning for Eastside Ward.",
      timestamp: "08:30 AM"
    },
    {
      sender: "user",
      content: "What's the status of the parks department budget?",
      timestamp: "08:45 AM"
    },
    {
      sender: "nova",
      content: "The Parks Department is currently 32% underspent for Q2. I've prepared options for reallocating these funds to pending infrastructure projects before the end of the fiscal year.",
      timestamp: "08:45 AM"
    }
  ];
  
  // Pulse Score calculation (would normally come from API)
  const pulseScore = 82;
  const getPulseColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };
  
  // Quick Apps data
  const quickApps = [
    { icon: <Building className="w-5 h-5" />, label: "2Vita", color: "text-blue-600", bgColor: "bg-blue-100", badge: "Connected" },
    { icon: <PenTool className="w-5 h-5" />, label: "Permit System", color: "text-purple-600", bgColor: "bg-purple-100", badge: "Connected" },
    { icon: <MessageCircle className="w-5 h-5" />, label: "CitizenConnect", color: "text-teal-600", bgColor: "bg-teal-100", badge: "Connected" },
    { icon: <Database className="w-5 h-5" />, label: "BudgetMaster", color: "text-amber-600", bgColor: "bg-amber-100", badge: "Connected" },
    { icon: <Truck className="w-5 h-5" />, label: "TylerTech", color: "text-indigo-600", bgColor: "bg-indigo-100" },
    { icon: <Building className="w-5 h-5" />, label: "Reentry", color: "text-green-600", bgColor: "bg-green-100" },
    { icon: <Plus className="w-5 h-5" />, label: "Add New", color: "text-slate-600", bgColor: "bg-slate-100", isAdd: true },
  ];
  
  return (
    <div className="flex flex-col h-full">
      {/* Top navigation/search bar */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md mb-4 border border-slate-100">
        <div className="flex items-center">
          <Command className="w-5 h-5 text-indigo-600 mr-2" />
          <h1 className="text-xl font-bold text-indigo-900">Civic Command Center</h1>
        </div>
        
        <div className="relative flex-1 max-w-2xl mx-8">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Ask Nova anything..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-slate-600 hover:text-indigo-600 transition-colors" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
              3
            </div>
          </div>
          
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-medium">
              M
            </div>
            <span className="text-sm text-slate-700">Mayor</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
      
      {/* Main dashboard content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - 8 cols */}
          <div className="col-span-8 space-y-4">
            {/* Top row - Pulse and KPIs */}
            <div className="grid grid-cols-4 gap-4">
              {/* Civic Pulse Score */}
              <div className="col-span-1 bg-white rounded-xl shadow-md p-4 border border-slate-100 flex flex-col items-center justify-center">
                <div className="relative">
                  <svg className="w-28 h-28">
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="50"
                      fill="none"
                      stroke={pulseScore >= 80 ? "#10b981" : pulseScore >= 60 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="10"
                      strokeDasharray="314"
                      strokeDashoffset={314 - (314 * pulseScore) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 56 56)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getPulseColor(pulseScore)}`}>{pulseScore}</span>
                    <span className="text-xs font-medium text-slate-500">CIVIC PULSE™</span>
                  </div>
                </div>
                <p className="text-sm text-center text-slate-600 mt-2">
                  Your city is operating at {pulseScore}% efficiency
                </p>
              </div>
              
              {/* KPI Cards */}
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {/* Resource Allocation */}
                <div className="bg-white rounded-xl shadow-md p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-indigo-900">Resources</h3>
                    <div className="flex items-center text-xs text-emerald-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      4.2%
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-indigo-900 mb-2">78%</div>
                  
                  <div className="space-y-2">
                    {[
                      { label: "Personnel", value: 82, color: "bg-emerald-500" },
                      { label: "Equipment", value: 65, color: "bg-amber-500" },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className="text-slate-600">{item.label}</span>
                          <span className="text-slate-700 font-medium">{item.value}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div 
                            className={`${item.color} h-1.5 rounded-full`} 
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Constituent Engagement */}
                <div className="bg-white rounded-xl shadow-md p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-indigo-900">Engagement</h3>
                    <div className="flex items-center text-xs text-blue-600">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      28%
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-indigo-900 mb-2">64%</div>
                  
                  <div className="h-16 mt-3 flex items-end">
                    {[30, 45, 38, 55, 50, 75].map((value, index) => (
                      <div key={index} className="flex-1 mx-0.5 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500 rounded-t-sm" 
                          style={{ height: `${value}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Budget Utilization */}
                <div className="bg-white rounded-xl shadow-md p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-indigo-900">Budget</h3>
                    <div className="flex items-center text-xs text-amber-600">
                      <ArrowDown className="w-3 h-3 mr-1" />
                      8.5%
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-indigo-900 mb-2">42%</div>
                  
                  <div className="flex justify-between items-end h-16 mt-3">
                    {[
                      { label: "Q1", value: 24, color: "bg-emerald-500" },
                      { label: "Q2", value: 18, color: "bg-amber-500" },
                      { label: "Q3", value: 0, color: "bg-slate-200" },
                      { label: "Q4", value: 0, color: "bg-slate-200" },
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center w-12">
                        <div 
                          className={`w-8 ${item.color} rounded-t-sm`} 
                          style={{ height: `${item.value ? (item.value / 30) * 100 : 2}%` }}
                        ></div>
                        <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Core Function Tiles */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-indigo-900">Core Functions</h2>
                <button className="flex items-center text-xs px-3 py-1.5 bg-white text-indigo-600 rounded-lg shadow-sm border border-slate-100 hover:bg-indigo-50 transition-colors">
                  View All
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <Activity className="w-6 h-6" />, label: "System Pulse", color: "text-emerald-600", bgColor: "bg-emerald-100", alerts: 0, status: "Healthy" },
                  { icon: <Users className="w-6 h-6" />, label: "Engagement", color: "text-blue-600", bgColor: "bg-blue-100", alerts: 2, status: "Active" },
                  { icon: <Folder className="w-6 h-6" />, label: "Documents", color: "text-indigo-600", bgColor: "bg-indigo-100", alerts: 5, status: "Updated" },
                  { icon: <BarChart3 className="w-6 h-6" />, label: "Budget", color: "text-amber-600", bgColor: "bg-amber-100", alerts: 0, status: "Review" },
                  { icon: <AlertTriangle className="w-6 h-6" />, label: "Alerts", color: "text-red-600", bgColor: "bg-red-100", alerts: 1, status: "Critical" },
                  { icon: <Lock className="w-6 h-6" />, label: "Security", color: "text-purple-600", bgColor: "bg-purple-100", alerts: 0, status: "Secured" },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 flex flex-col items-center cursor-pointer hover:translate-y-[-2px] transition-all duration-200 border border-slate-100 relative"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${item.bgColor} ${item.color} mb-3`}>
                      {item.icon}
                    </div>
                    <div className="text-sm font-medium text-slate-800">{item.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{item.status}</div>
                    
                    {item.alerts > 0 && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                        {item.alerts}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Apps Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-indigo-900">Your Connected Apps</h2>
                <div className="flex space-x-2">
                  <button className="flex items-center text-xs px-3 py-1.5 bg-white text-indigo-600 rounded-lg shadow-sm border border-slate-100 hover:bg-indigo-50 transition-colors">
                    <Plus className="w-3 h-3 mr-1" />
                    Add App
                  </button>
                  <button className="flex items-center text-xs px-3 py-1.5 bg-white text-indigo-600 rounded-lg shadow-sm border border-slate-100 hover:bg-indigo-50 transition-colors">
                    Manage
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {quickApps.map((app, index) => (
                  <div 
                    key={index} 
                    className={`bg-white rounded-lg shadow-sm hover:shadow-md p-3 flex items-center cursor-pointer hover:translate-y-[-2px] transition-all duration-200 border ${app.isAdd ? 'border-dashed border-slate-300' : 'border-slate-100'}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${app.bgColor} ${app.color} mr-3`}>
                      {app.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-800">{app.label}</div>
                      {app.badge && (
                        <div className="text-xs text-slate-500 flex items-center">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>
                          {app.badge}
                        </div>
                      )}
                    </div>
                    {!app.isAdd && (
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - 4 cols */}
          <div className="col-span-4 space-y-4">
            {/* Nova's Priority Alerts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Zap className="w-5 h-5 text-amber-500 mr-2" />
                  <h2 className="text-lg font-semibold text-indigo-900">Nova's Summary</h2>
                </div>
                <button className="flex items-center text-xs px-3 py-1.5 bg-white text-indigo-600 rounded-lg shadow-sm border border-slate-100 hover:bg-indigo-50 transition-colors">
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {priorityAlerts.map((alert, index) => {
                  const style = messageTypes[alert.type];
                  return (
                    <div 
                      key={index} 
                      className={`${style.bg} backdrop-blur-sm ${style.text} p-4 rounded-xl shadow-md border ${style.border}`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          {style.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="font-semibold">
                              {alert.type === "critical" && <span className="text-red-600 mr-1">CRITICAL:</span>}
                              {alert.title}
                            </div>
                            <span className="text-xs opacity-75 whitespace-nowrap ml-2">{alert.time}</span>
                          </div>
                          <div className="text-sm mt-1">{alert.content}</div>
                          
                          <div className="flex justify-end mt-2">
                            <button 
                              onClick={alert.action}
                              className={`text-xs px-3 py-1.5 rounded-lg shadow-sm ${
                                alert.type === "critical" 
                                  ? "bg-red-600 text-white hover:bg-red-700" 
                                  : alert.type === "warning"
                                    ? "bg-amber-600 text-white hover:bg-amber-700"
                                    : "bg-white text-indigo-600 hover:bg-indigo-50 border border-slate-100"
                              } transition-colors`}
                            >
                              {alert.actionLabel}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Nova AI Chat Panel */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 flex flex-col h-96">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 relative">
                    <div className="absolute inset-0 bg-indigo-400 rounded-full opacity-20 animate-ping"></div>
                    <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-70"></div>
                    <div className="absolute inset-2 bg-white rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-indigo-900">Nova AI Assistant</h3>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
                <div className="space-y-4">
                  {novaMessages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div 
                          className={`text-xs mt-1 text-right ${
                            message.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                          }`}
                        >
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="px-4 py-3 border-t border-slate-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type a message to Nova..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-700 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Calendar Preview */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-indigo-900">Today's Schedule</h3>
                <button className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
                  View Calendar
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { time: "10:00 AM", title: "Budget Committee Meeting", location: "City Hall, Room 302" },
                  { time: "02:00 PM", title: "Parks Department Review", location: "Conference Room B" },
                  { time: "04:30 PM", title: "Constituent Office Hours", location: "Community Center" },
                ].map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-16 text-xs font-medium text-slate-500 pt-0.5">
                      {event.time}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{event.title}</div>
                      <div className="text-xs text-slate-500">{event.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Nova AI Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => setShowChatPanel(!showChatPanel)}
          className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}