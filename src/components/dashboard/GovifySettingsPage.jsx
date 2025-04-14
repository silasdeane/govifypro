import React, { useState } from 'react';
import { Save, Bell, Lock, Users, Globe, Moon, Sun, HelpCircle, Database } from 'lucide-react';

const GovifySettingsPage = () => {
  // State for settings
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [autoSave, setAutoSave] = useState(true);
  const [dataRetention, setDataRetention] = useState('90 days');
  
  // Handle save settings
  const handleSaveSettings = () => {
    // Demo only: show success message
    alert('Settings saved successfully!');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-indigo-900">Settings</h1>
        <button 
          onClick={handleSaveSettings}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>
      
      {/* Settings Container */}
      <div className="bg-white rounded-xl shadow-sm flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* General Settings */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-indigo-800 border-b border-indigo-100 pb-2">General</h2>
            
            {/* Account */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                Account
              </h3>
              
              <div className="pl-6 space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <input 
                    type="text" 
                    defaultValue="Mayor Thompson" 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input 
                    type="email" 
                    defaultValue="mayor@springfield.gov" 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
            
            {/* Appearance */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                {darkMode ? <Moon size={18} className="text-indigo-600" /> : <Sun size={18} className="text-indigo-600" />}
                Appearance
              </h3>
              
              <div className="pl-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                    <div className={`block w-10 h-6 rounded-full ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${darkMode ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700">
                    Dark Mode
                  </div>
                </label>
              </div>
            </div>
            
            {/* Language */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                <Globe size={18} className="text-indigo-600" />
                Language
              </h3>
              
              <div className="pl-6">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* System Settings */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-indigo-800 border-b border-indigo-100 pb-2">System</h2>
            
            {/* Notifications */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                <Bell size={18} className="text-indigo-600" />
                Notifications
              </h3>
              
              <div className="pl-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                    />
                    <div className={`block w-10 h-6 rounded-full ${notifications ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${notifications ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700">
                    Enable Notifications
                  </div>
                </label>
              </div>
            </div>
            
            {/* Auto Save */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                <Save size={18} className="text-indigo-600" />
                Auto Save
              </h3>
              
              <div className="pl-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={autoSave}
                      onChange={() => setAutoSave(!autoSave)}
                    />
                    <div className={`block w-10 h-6 rounded-full ${autoSave ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${autoSave ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-gray-700">
                    Enable Auto Save
                  </div>
                </label>
              </div>
            </div>
            
            {/* Data & Privacy */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                <Database size={18} className="text-indigo-600" />
                Data & Privacy
              </h3>
              
              <div className="pl-6 space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Data Retention Period</label>
                  <select 
                    value={dataRetention}
                    onChange={(e) => setDataRetention(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none transition"
                  >
                    <option value="30 days">30 days</option>
                    <option value="90 days">90 days</option>
                    <option value="1 year">1 year</option>
                    <option value="Forever">Forever</option>
                  </select>
                </div>
                
                <button className="text-sm text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 mt-2">
                  <Lock size={14} />
                  View Privacy Policy
                </button>
              </div>
            </div>
            
            {/* Help */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
                <HelpCircle size={18} className="text-indigo-600" />
                Help & Support
              </h3>
              
              <div className="pl-6 space-y-2">
                <button className="text-sm text-indigo-600 hover:text-indigo-800 transition block">Contact Support</button>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 transition block">Documentation</button>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 transition block">What's New</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovifySettingsPage;