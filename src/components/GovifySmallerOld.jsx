import { useState } from 'react';
import { 
  AlertTriangle, Bell, Settings, User, Home, Folder, Users, 
  MessageSquare, BarChart3, Activity, Shield, Lock, Send, Plus, Grid, 
  MessageCircle, ChevronDown, X, AlertCircle, Info, CheckCircle,
  ExternalLink, PenTool, FileText, Database, CalendarDays, Truck, Building
} from 'lucide-react';

export default function GovifyCommandCenter() {
  const [directiveInput, setDirectiveInput] = useState("");
  
  // Message categories and their styling for Nova AI chat
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
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      text: "text-indigo-700"
    },
    success: {
      icon: <CheckCircle className="w-4 h-4" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700"
    },
    neutral: {
      icon: <Info className="w-4 h-4" />,
      bg: "bg-white",
      border: "border-slate-100",
      text: "text-slate-700"
    }
  };
  
  const novaMessages = [
    {
      type: "critical",
      title: "Flood warning for downtown area",
      content: "Preparing emergency response plan. Municipal services on high alert. Evacuation routes established.",
      time: "10 mins ago",
      actionable: true
    },
    {
      type: "warning",
      title: "Budget allocation issue detected",
      content: "Parks Department showing 32% underspent for Q2. Recommend reallocation to pending infrastructure projects.",
      time: "30 mins ago",
      actionable: true
    },
    {
      type: "info",
      title: "Constituent engagement rising",
      content: "Community feedback up 24% this month. Main topics: road repairs (38%), park safety (27%), recycling program (18%).",
      time: "1 hr ago",
      actionable: false
    },
    {
      type: "neutral",
      title: "System maintenance scheduled",
      content: "Scheduled maintenance for City Hall HVAC approved for next Tuesday. No service disruptions expected.",
      time: "2 hrs ago",
      actionable: false
    }
  ];
  
  return (
    <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 shadow-lg">
      {/* Central directive input */}
      <div className="px-6 py-4 flex">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Enter a directive or ask Nova AI..."
            value={directiveInput}
            onChange={(e) => setDirectiveInput(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-100 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-indigo-900"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-700 transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="ml-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-indigo-600 cursor-pointer" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white shadow-md">3</div>
          </div>
        </div>
      </div>
      
      {/* Pulse Orb - Civic Health at a Glance */}
      <div className="px-6 pb-6 flex justify-between items-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-400/10 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-indigo-400/20 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute inset-4 bg-white backdrop-blur-lg rounded-full shadow-lg border border-white/80 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-indigo-900">78</div>
            <div className="text-xs text-indigo-600 font-medium">CIVIC PULSE</div>
          </div>
        </div>
        
        <div className="flex-1 ml-6">
          <h1 className="text-2xl font-bold text-indigo-900 mb-2">Phoenixville Command Center<span className="text-sm align-super ml-1 text-indigo-500">™</span></h1>
          <p className="text-sm text-slate-700 max-w-lg">Your city is operating at 78% efficiency. There's one <span className="text-red-500 font-medium">critical alert</span> and two <span className="text-amber-500 font-medium">pending issues</span> requiring attention.</p>
        </div>
        
        <div className="flex flex-col space-y-2">
          <div className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded flex items-center shadow-md">
            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-1"></span>
            Nova AI Active
          </div>
          <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded flex items-center shadow-md">
            <span className="w-2 h-2 bg-emerald-600 rounded-full mr-1"></span>
            32 Staff Online
          </div>
        </div>
      </div>
      
      {/* Main dashboard area */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-12 gap-4">
          {/* Core Apps and Quick Apps */}
          <div className="col-span-8 flex flex-col space-y-6">
            {/* Core Apps - 3x2 grid with improved spacing */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-indigo-900">Core Functions</h2>
                <button className="text-xs px-2 py-1 rounded bg-white text-indigo-600 hover:bg-indigo-50 transition-colors shadow-md">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-3 gap-5">
                {[
                  { icon: <Activity className="w-6 h-6" />, label: "System Pulse", color: "text-emerald-600", bgColor: "bg-emerald-100", alerts: 0 },
                  { icon: <Users className="w-6 h-6" />, label: "Engagement", color: "text-blue-600", bgColor: "bg-blue-100", alerts: 2 },
                  { icon: <Folder className="w-6 h-6" />, label: "Documents", color: "text-indigo-600", bgColor: "bg-indigo-100", alerts: 5 },
                  { icon: <BarChart3 className="w-6 h-6" />, label: "Budget", color: "text-amber-600", bgColor: "bg-amber-100", alerts: 0 },
                  { icon: <AlertTriangle className="w-6 h-6" />, label: "Alerts", color: "text-red-600", bgColor: "bg-red-100", alerts: 1 },
                  { icon: <Lock className="w-6 h-6" />, label: "Security", color: "text-purple-600", bgColor: "bg-purple-100", alerts: 0 },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg p-5 flex flex-col items-center justify-center cursor-pointer hover:translate-y-[-2px] transition-all duration-200 border border-slate-100 h-36 relative"
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${item.bgColor} ${item.color} shadow-md mb-3`}>
                      {item.icon}
                    </div>
                    <div className="text-sm font-medium text-slate-800">{item.label}</div>
                    {item.alerts > 0 && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs text-white shadow-md">
                        {item.alerts}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Apps Section - For Third-party Integrations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-indigo-900">Quick Apps</h2>
                <div className="flex items-center space-x-2">
                  <button className="text-xs px-2 py-1 rounded bg-white text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center shadow-md">
                    <Plus className="w-3 h-3 mr-1" />
                    Add App
                  </button>
                  <button className="text-xs px-2 py-1 rounded bg-white text-indigo-600 hover:bg-indigo-50 transition-colors shadow-md">
                    Manage
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: <Building className="w-5 h-5" />, label: "2vita", color: "text-blue-600", bgColor: "bg-blue-100", badge: "Connected" },
                  { icon: <CalendarDays className="w-5 h-5" />, label: "Scheduler Pro", color: "text-emerald-600", bgColor: "bg-emerald-100" },
                  { icon: <Database className="w-5 h-5" />, label: "Data Warehouse", color: "text-purple-600", bgColor: "bg-purple-100" },
                  { icon: <FileText className="w-5 h-5" />, label: "Doc Portal", color: "text-amber-600", bgColor: "bg-amber-100" },
                  { icon: <Truck className="w-5 h-5" />, label: "Tyler Tech", color: "text-indigo-600", bgColor: "bg-indigo-100" },
                  { icon: <PenTool className="w-5 h-5" />, label: "Permit System", color: "text-teal-600", bgColor: "bg-teal-100" },
                  { icon: <Plus className="w-5 h-5" />, label: "Add New", color: "text-slate-600", bgColor: "bg-slate-100", isAdd: true },
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={`bg-white backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg p-3 flex items-center cursor-pointer hover:translate-y-[-2px] transition-all duration-200 border ${item.isAdd ? 'border-dashed border-slate-300' : 'border-slate-100'} relative`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bgColor} ${item.color} shadow-md mr-3`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-800">{item.label}</div>
                      {item.badge && (
                        <div className="text-xs text-slate-500 flex items-center">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>
                          {item.badge}
                        </div>
                      )}
                    </div>
                    {!item.isAdd && (
                      <ExternalLink className="w-4 h-4 text-slate-400 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Performance Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {/* Resource Allocation */}
              <div className="bg-white backdrop-blur-md rounded-xl shadow-md p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-indigo-900">Resource Allocation</h3>
                  <div className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded shadow-md">Healthy</div>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="text-2xl font-bold text-indigo-900">78%</div>
                  <div className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded flex items-center shadow-sm">
                    +4.2%
                  </div>
                </div>
                
                <div className="space-y-2">
                  {[
                    { label: "Personnel", value: 82, color: "bg-emerald-500" },
                    { label: "Equipment", value: 65, color: "bg-amber-500" },
                    { label: "Facilities", value: 91, color: "bg-emerald-500" },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-700">{item.label}</span>
                        <span className="text-slate-700 font-medium">{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-100 backdrop-blur-sm rounded-full h-1.5 shadow-inner">
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
              <div className="bg-white backdrop-blur-md rounded-xl shadow-md p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-indigo-900">Engagement</h3>
                  <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded shadow-md">Rising</div>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="text-2xl font-bold text-indigo-900">65%</div>
                  <div className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded flex items-center shadow-sm">
                    +12.3%
                  </div>
                </div>
                
                <div className="h-24 relative">
                  <svg viewBox="0 0 100 30" className="w-full h-full">
                    <path 
                      d="M 0,20 C 5,19 10,18 15,16 C 20,14 25,15 30,14 C 35,13 40,10 45,8 C 50,6 55,7 60,9 C 65,11 70,13 75,12 C 80,11 85,9 90,7 C 95,5 100,4 105,3" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="1.5"
                    />
                    <circle cx="90" cy="7" r="2" fill="#3b82f6" />
                  </svg>
                  
                  <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-slate-500">
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
              </div>
              
              {/* Budget Utilization */}
              <div className="bg-white backdrop-blur-md rounded-xl shadow-md p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-indigo-900">Budget Utilization</h3>
                  <div className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded shadow-md">Review</div>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="text-2xl font-bold text-indigo-900">42%</div>
                  <div className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded flex items-center shadow-sm">
                    -8.5%
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-1 h-24">
                  {[
                    { label: "Q1", value: 24, color: "bg-emerald-500" },
                    { label: "Q2", value: 18, color: "bg-amber-500" },
                    { label: "Q3", value: 0, color: "bg-slate-200" },
                    { label: "Q4", value: 0, color: "bg-slate-200" },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="flex-1 w-full flex items-end">
                        <div 
                          className={`w-full ${item.color} rounded-t-lg shadow-sm`} 
                          style={{ height: `${item.value ? (item.value / 30) * 100 : 2}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Nova AI Insights & Feed - Improved Chat UI */}
          <div className="col-span-4 bg-white backdrop-blur-md rounded-xl shadow-md flex flex-col border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-indigo-400/30 flex items-center justify-center mr-2">
                  <div className="w-4 h-4 rounded-full bg-indigo-500 animate-pulse"></div>
                </div>
                <h3 className="font-semibold text-indigo-900">AI Summary</h3>
              </div>
              <div className="flex space-x-2">
                <button className="text-xs px-2 py-1 rounded bg-white text-indigo-600 hover:bg-indigo-50 transition-colors shadow-md">
                  View All
                </button>
                <button className="text-xs px-2 py-1 rounded bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-md">
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="space-y-3">
                {novaMessages.map((msg, index) => {
                  const style = messageTypes[msg.type];
                  return (
                    <div 
                      key={index} 
                      className={`text-xs ${style.bg} backdrop-blur-sm ${style.text} p-3 rounded-lg flex items-start shadow-md border ${style.border}`}
                    >
                      <div className="mr-2 mt-0.5 flex-shrink-0">
                        {style.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div className="font-semibold mb-1">
                            {msg.type === "critical" && <span className="text-red-600 mr-1">CRITICAL:</span>}
                            {msg.title}
                          </div>
                          <div className="flex space-x-1">
                            <span className="text-xs opacity-50">{msg.time}</span>
                            <button className="opacity-50 hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div>{msg.content}</div>
                        
                        {msg.actionable && (
                          <div className="mt-2 flex space-x-2">
                            <button className={`text-xs px-2 py-1 rounded bg-white/80 ${style.text} hover:bg-white transition-colors shadow-sm`}>
                              View Details
                            </button>
                            <button className={`text-xs px-2 py-1 rounded ${msg.type === "critical" ? "bg-red-600 text-white" : "bg-amber-600 text-white"} hover:opacity-90 transition-opacity shadow-md`}>
                              {msg.type === "critical" ? "Take Action" : "Review"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 shadow-md">
                <MessageCircle className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ask Nova AI a question..."
                  className="w-full pl-3 pr-9 py-2 text-sm rounded-lg border border-slate-100 bg-white shadow-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-indigo-900"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}