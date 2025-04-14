import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Folder, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Grid, 
  Settings, 
  Shield, 
  User, 
  Plus,
  Mail
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Pre-defined navigation items
  const navigationItems = [
    { path: '/', icon: <Home className="w-4 h-4" />, label: "Dashboard" },
    { path: '/comms', icon: <Mail className="w-4 h-4" />, label: "Comms" },
    { path: '/documents', icon: <Folder className="w-4 h-4" />, label: "Documents" },
    { path: '/people', icon: <Users className="w-4 h-4" />, label: "People" },
    { path: '/data', icon: <BarChart3 className="w-4 h-4" />, label: "Data" },
    { path: '/apps', icon: <Grid className="w-4 h-4" />, label: "Apps" },
    { path: '/settings', icon: <Settings className="w-4 h-4" />, label: "Settings" },
  ];

  return (
    <div className="w-48 bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg flex flex-col border border-white/80 m-4">
      <div className="p-3 border-b border-slate-200/50 flex items-center justify-center">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2 shadow-md">
          <Shield className="text-white w-5 h-5" />
        </div>
        <Link to="/" className="text-lg font-semibold text-indigo-700">Govify</Link>
      </div>
      
      <div className="flex-1 overflow-y-auto pt-2">
        <div className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={"flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 " + 
                (currentPath === item.path 
                  ? 'bg-indigo-100 text-indigo-700 shadow-md' 
                  : 'text-slate-700 hover:bg-white hover:shadow-md'
                )
              }
            >
              <div className="mr-2">{item.icon}</div>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Add the "+" button for power tools/hidden modules */}
      <div className="px-2 pb-2">
        <div className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 text-slate-700 hover:bg-white hover:shadow-md">
          <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center shadow-sm mr-2">
            <Plus className="w-3 h-3 text-indigo-700" />
          </div>
          <span className="text-sm">Power Tools</span>
        </div>
      </div>
      
      <div className="p-3 border-t border-slate-200/50 flex items-center">
        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center shadow-md">
          <User className="w-4 h-4 text-indigo-700" />
        </div>
        <div className="ml-2">
          <div className="text-xs font-medium text-slate-800">Mayor Urshler</div>
          <div className="text-xs text-slate-500">Mayor</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;