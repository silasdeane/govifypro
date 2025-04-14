import { useState } from 'react';
import { 
  Users, User, Building, Search, Filter, Plus, 
  MessageCircle, Flag, MoreHorizontal, X, 
  AlertTriangle, AlertCircle, CheckCircle, Activity, Mail, Grid, List
} from 'lucide-react';

export default function GovifyPeoplePage() {
  const [activeTab, setActiveTab] = useState('constituents');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedPerson, setSelectedPerson] = useState(null);

  const overviewCards = [
    { title: 'Total Constituents', value: '24,387', change: '+156', icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Active Staff', value: '346', change: '-2', icon: <User className="w-5 h-5" />, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { title: 'Departments', value: '14', change: '0', icon: <Building className="w-5 h-5" />, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { title: 'People Alerts', value: '28', change: '+7', icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-600', bgColor: 'bg-red-100' },
    { title: 'Engagement', value: '62%', change: '+8%', icon: <Activity className="w-5 h-5" />, color: 'text-amber-600', bgColor: 'bg-amber-100' }
  ];

  const constituentsList = [
    { id: '1', name: 'Robert Chen', contact: 'robert.chen@email.com', address: '1247 Maple Street', engagement: 'High', engagementScore: 87, tags: ['Volunteer', 'Community Leader'], lastInteraction: '2 days ago' },
    { id: '2', name: 'Maria Rodriguez', contact: '(555) 234-5678', address: '783 Oak Avenue', engagement: 'Medium', engagementScore: 53, tags: ['Housing Assistance'], lastInteraction: '1 week ago' },
    { id: '3', name: 'James Wilson', contact: 'james.w@email.com', address: '456 Pine Road', engagement: 'Low', engagementScore: 24, tags: ['Small Business Owner', 'New Resident'], lastInteraction: '3 months ago' },
    { id: '4', name: 'Amara Johnson', contact: '(555) 876-5432', address: '922 Elm Court', engagement: 'High', engagementScore: 92, tags: ['Returning Citizen', 'Job Seeker'], lastInteraction: 'Yesterday' },
    { id: '5', name: 'David Park', contact: 'david.p@email.com', address: '2044 Cedar Lane', engagement: 'Medium', engagementScore: 65, tags: ['Veteran', 'Senior'], lastInteraction: '2 weeks ago' }
  ];

  const renderEngagementBadge = (level, score) => {
    let bgColor = 'bg-slate-100';
    let textColor = 'text-slate-700';
    let icon = <Activity className="w-3 h-3" />;
    if (score >= 80) {
      bgColor = 'bg-emerald-100';
      textColor = 'text-emerald-700';
      icon = <CheckCircle className="w-3 h-3" />;
    } else if (score >= 50) {
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-700';
    } else {
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-700';
      icon = <AlertCircle className="w-3 h-3" />;
    }
    return <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${bgColor} ${textColor} text-xs`}>{icon}<span>{level}</span></div>;
  };

  const renderTag = (tag) => <span key={tag} className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs shadow-sm mr-1 last:mr-0">{tag}</span>;

  return (
    <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 shadow-lg">
      <div className="px-6 py-4 border-b border-white/30 flex flex-wrap justify-between items-center gap-3">
        <div className="relative flex-1 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center"><Search className="w-5 h-5 text-slate-400" /></div>
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-slate-100 bg-white shadow-md rounded-xl text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3"><Filter className="w-5 h-5 text-slate-400 hover:text-indigo-600 cursor-pointer" /></div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setViewMode('table')} className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-5 h-5" /></button>
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid className="w-5 h-5" /></button>
          <button className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"><Plus className="w-4 h-4 mr-1" /><span>Add Person</span></button>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {overviewCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4 border border-slate-100 hover:shadow-lg transition-transform hover:-translate-y-0.5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bgColor} ${card.color}`}>{card.icon}</div>
              <div>
                <div className="text-xs font-medium text-slate-500 mb-1">{card.title}</div>
                <div className="flex items-center">
                  <div className="text-xl font-bold text-indigo-900">{card.value}</div>
                  <div className={`ml-2 text-xs ${card.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>{card.change}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 flex border-b border-slate-200">
        {[
          { id: 'constituents', label: 'Constituents', icon: <Users className="w-4 h-4 mr-1" />, count: constituentsList.length },
          { id: 'staff', label: 'Staff', icon: <User className="w-4 h-4 mr-1" />, count: 5 },
          { id: 'departments', label: 'Departments', icon: <Building className="w-4 h-4 mr-1" />, count: 5 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-600 hover:text-indigo-500 hover:border-indigo-300'}`}
          >
            {tab.icon}{tab.label}
            <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="px-6 py-4 flex-1 overflow-y-auto pb-28">
        <table className="min-w-full divide-y divide-slate-200 bg-white rounded-xl shadow-md overflow-hidden">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Engagement Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Interaction</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {constituentsList.map((person) => (
              <tr key={person.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-indigo-900">{person.name}</div>
                  <div className="text-xs text-slate-500">{person.address}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{person.contact}</td>
                <td className="px-6 py-4">{renderEngagementBadge(person.engagement, person.engagementScore)}</td>
                <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{person.tags.map(renderTag)}</div></td>
                <td className="px-6 py-4 text-sm text-slate-500">{person.lastInteraction}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button title="Message" className="text-indigo-600 hover:text-indigo-900"><MessageCircle className="w-4 h-4" /></button>
                    <button title="Flag" className="text-amber-600 hover:text-amber-900"><Flag className="w-4 h-4" /></button>
                    <button title="More" className="text-slate-600 hover:text-slate-900"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
