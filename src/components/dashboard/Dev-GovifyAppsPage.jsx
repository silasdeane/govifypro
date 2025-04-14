import { useState } from 'react';
import EnhancedAppInfoCard from './EnhancedAppInfoCard';

import { 
  Grid, Search, Plus, MoreHorizontal, ExternalLink, ArrowRight, Download,
  Book, Code, Star, Zap, Shield, ChevronRight, Award, Layers, 
  Terminal, Settings, Monitor, Share2, GitBranch, Wrench, CheckCircle, 
  Clock, Users, RefreshCw, Bookmark, ChevronDown, PlayCircle,
  LayoutGrid, Sparkles, Database, HeartHandshake, Briefcase, DollarSign
} from 'lucide-react';

export default function GovifyAppsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedAppId, setExpandedAppId] = useState(null);
  
  const categories = [
    { id: 'all', label: 'All Apps', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'featured', label: 'Featured', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'data', label: 'Data Integration', icon: <Database className="w-4 h-4" /> },
    { id: 'citizen', label: 'Citizen Services', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'operations', label: 'Operations', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'finance', label: 'Finance', icon: <DollarSign className="w-4 h-4" /> }
  ];
  
  // Featured ecosystem apps
  const ecosystemApps = [
    {
      id: 1,
      name: 'Permit Tracker Pro',
      developer: 'CivicTech Solutions',
      category: 'citizen',
      description: 'Streamlined permit application and real-time status tracking for residents and businesses.',
      users: 128,
      rating: 4.8,
      featured: true,
      verified: true,
      icon: <Layers className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      integration: 'Deep Integration'
    },
    {
      id: 2,
      name: 'Budget Insights',
      developer: 'GovFinancials',
      category: 'finance',
      description: 'Advanced financial analytics and visualization tools for municipal budget planning.',
      users: 76,
      rating: 4.5,
      featured: true,
      verified: true,
      icon: <Monitor className="w-6 h-6" />,
      color: 'bg-emerald-100 text-emerald-600',
      integration: 'Data Access'
    },
    {
      id: 3,
      name: 'CivicEngage',
      developer: 'PublicWorks Digital',
      category: 'citizen',
      description: 'Community participation platform for gathering feedback on public projects.',
      users: 93,
      rating: 4.7,
      featured: false,
      verified: true,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
      integration: 'Full Platform'
    },
    {
      id: 4,
      name: 'InfraWatch',
      developer: 'SmartCity Inc.',
      category: 'operations',
      description: 'Real-time monitoring of city infrastructure and preventative maintenance scheduling.',
      users: 52,
      rating: 4.3,
      featured: true,
      verified: false,
      icon: <Wrench className="w-6 h-6" />,
      color: 'bg-amber-100 text-amber-600',
      integration: 'API Access'
    },
    {
      id: 5,
      name: 'DataSync Analytics',
      developer: 'ClearView Data',
      category: 'data',
      description: 'Secure data synchronization and analytics for cross-department collaboration.',
      users: 84,
      rating: 4.6,
      featured: false,
      verified: true,
      icon: <GitBranch className="w-6 h-6" />,
      color: 'bg-indigo-100 text-indigo-600',
      integration: 'Deep Integration'
    },
    {
      id: 6,
      name: 'CitizenVoice',
      developer: 'Civic Engagement Labs',
      category: 'citizen',
      description: 'Feedback and service request platform with automated routing and status updates.',
      users: 106,
      rating: 4.4,
      featured: false,
      verified: true,
      icon: <Share2 className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600',
      integration: 'API Access'
    }
  ];
  
  // Development tools and resources
  const devResources = [
    {
      title: 'API Documentation',
      description: 'Comprehensive guides for all Govify API endpoints.',
      icon: <Book className="w-5 h-5" />,
      link: '/developer/docs',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Developer Console',
      description: 'Create and manage your API keys and applications.',
      icon: <Terminal className="w-5 h-5" />,
      link: '/developer/console',
      color: 'bg-slate-800 text-white'
    },
    {
      title: 'SDK Downloads',
      description: 'Ready-to-use libraries for major programming languages.',
      icon: <Download className="w-5 h-5" />,
      link: '/developer/sdks',
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'Sample Projects',
      description: 'Example applications to jumpstart your development.',
      icon: <Code className="w-5 h-5" />,
      link: '/developer/samples',
      color: 'bg-purple-100 text-purple-600'
    }
  ];
  
  // Filter apps based on active category and search query
  const filteredApps = ecosystemApps.filter(app => {
    const matchesCategory = activeCategory === 'all' || 
                          (activeCategory === 'featured' && app.featured) || 
                          app.category === activeCategory;
    
    const matchesSearch = searchQuery === '' || 
                        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        app.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  const handleAppExpand = (appId) => {
    if (expandedAppId === appId) {
      setExpandedAppId(null);
    } else {
      setExpandedAppId(appId);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 shadow-lg">
      {/* Header section */}
      <div className="p-5 border-b border-slate-200/50 bg-white/20">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold text-indigo-900">App Ecosystem</h1>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center shadow-sm border border-slate-100">
              <Grid className="w-4 h-4 mr-1.5" /> Browse Marketplace
            </button>
            <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" /> Create App
            </button>
          </div>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col items-center space-y-4">
          {/* Search input */}
          <div className="w-full max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search apps, integrations, or tools..."
                className="w-full px-4 py-2.5 pl-10 border border-slate-200 rounded-lg text-sm bg-white/90 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          
          {/* Category tabs - Centered */}
          <div className="flex justify-center w-full">
            <div className="inline-flex bg-white/80 rounded-lg shadow-sm border border-slate-100 p-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-md flex items-center ${
                    activeCategory === category.id 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="mr-1.5">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-8">
          {/* Developer spotlight section */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl overflow-hidden shadow-md">
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center">
              <div className="md:w-3/5 mb-5 md:mb-0 md:pr-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Build the Future of Civic Technology</h2>
                <p className="text-indigo-100 mb-6">Join our developer ecosystem and create applications that transform how local governments serve their communities.</p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-2.5 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 font-medium shadow-sm flex items-center transition-all">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  <button className="px-6 py-2.5 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 flex items-center shadow-sm border border-indigo-600 transition-all">
                    <PlayCircle className="w-4 h-4 mr-2" /> Watch Demo
                  </button>
                </div>
              </div>
              <div className="md:w-2/5">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-white">
                  <div className="flex items-center mb-3">
                    <Code className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">Powerful, Simple APIs</h3>
                  </div>
                  <div className="font-mono text-xs bg-indigo-900/70 rounded-md p-3 overflow-x-auto mb-3">
                    <div className="text-emerald-400">GET /api/v1/services/permits/status/:id</div>
                    <div className="text-indigo-300 mt-2">{"{"}</div>
                    <div className="text-indigo-300 ml-4">"status": "approved",</div>
                    <div className="text-indigo-300 ml-4">"updated_at": "2025-04-02T14:30:00Z",</div>
                    <div className="text-indigo-300 ml-4">"next_steps": [...]</div>
                    <div className="text-indigo-300">{"}"}</div>
                  </div>
                  <div className="flex items-center text-xs">
                    <Zap className="w-3.5 h-3.5 mr-1.5 text-yellow-300" />
                    <span className="text-indigo-200">200+ endpoints across 14 service domains</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Developer tools section */}
          <div>
            <h2 className="text-lg font-semibold text-indigo-900 mb-4">Developer Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {devResources.map((resource, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className={`w-12 h-12 rounded-lg ${resource.color} flex items-center justify-center mb-4 shadow-sm`}>
                      {resource.icon}
                    </div>
                    <h3 className="font-medium text-slate-900 mb-1">{resource.title}</h3>
                    <p className="text-sm text-slate-600 mb-3">{resource.description}</p>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                      Explore <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Ecosystem apps section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-indigo-900">Ecosystem Apps</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredApps.map(app => (
                  <div 
                    key={app.id} 
                    className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:border-indigo-200 transition-all ${
                      expandedAppId === app.id ? 'ring-1 ring-indigo-300' : ''
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className={`w-12 h-12 rounded-lg ${app.color} flex items-center justify-center mr-3 shadow-sm`}>
                          {app.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-slate-900 flex items-center">
                                {app.name}
                                {app.verified && (
                                  <span className="ml-1.5 bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                                    <CheckCircle className="w-3 h-3 mr-0.5" /> Verified
                                  </span>
                                )}
                              </h3>
                              <div className="text-xs text-slate-500 mt-0.5">by {app.developer}</div>
                            </div>
                            <button 
                              className="text-slate-400 hover:text-slate-600 p-1"
                              onClick={() => handleAppExpand(app.id)}
                            >
                              <ChevronDown className={`w-4 h-4 transform transition-transform ${expandedAppId === app.id ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{app.description}</p>
                        </div>
                      </div>
                      
                      {expandedAppId === app.id && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center">
                              <div className="text-xs text-slate-500">Rating</div>
                              <div className="flex items-center justify-center mt-1">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-medium text-slate-900 ml-1">{app.rating}</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-500">Users</div>
                              <div className="text-sm font-medium text-slate-900 mt-1">{app.users}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-500">Integration</div>
                              <div className="text-xs font-medium text-slate-900 mt-1">{app.integration}</div>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                              Learn More <ExternalLink className="w-3 h-3 ml-1" />
                            </button>
                            <button className="text-xs px-2.5 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                              Install
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">No apps found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  We couldn't find any apps matching your search criteria. Try adjusting your filters or search query.
                </p>
                <button 
                  className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-lg border border-slate-200 hover:bg-indigo-50 shadow-sm"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-1.5 inline-block" /> Reset Filters
                </button>
              </div>
            )}
          </div>
          
          {/* Developer benefits section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-indigo-900 mb-5">Why Build on Govify?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mr-3">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">Access to Customers</h3>
                      <p className="text-sm text-slate-600 mt-1">Reach 10,000+ municipal workers across 400+ local governments.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">Secure Infrastructure</h3>
                      <p className="text-sm text-slate-600 mt-1">Built-in compliance with government security standards.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">Developer Success</h3>
                      <p className="text-sm text-slate-600 mt-1">Technical support, marketing resources, and partner status.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">
                  Join Developer Program
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-200/50 bg-white/10 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs text-slate-500">
            <Settings className="w-3.5 h-3.5 mr-1.5" />
            <span>Developer Settings</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-xs text-slate-600 hover:text-indigo-600">Documentation</a>
            <a href="#" className="text-xs text-slate-600 hover:text-indigo-600">Support</a>
            <a href="#" className="text-xs text-slate-600 hover:text-indigo-600">Community</a>
          </div>
        </div>
      </div>
    </div>
  );
}