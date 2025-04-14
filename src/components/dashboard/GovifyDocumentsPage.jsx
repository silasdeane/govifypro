import { useState } from 'react';
import { 
  Search, Filter, Plus, FolderOpen, FileText, Calendar, Users, 
  Tag, FileCheck, Paperclip, Clock, Download, Share2, Star,
  ChevronDown, MoreHorizontal, Zap, Brain, Eye, Lock, ChevronRight,
  BarChart2, HelpCircle, RefreshCw, CheckCircle, Book, Shield,
  MessageSquare, FileUp, Grid, List, GitBranch, History,
  ExternalLink, ArrowUpRight, Sparkles, Activity, PieChart,
  Link2, Globe, MessageCircle
} from 'lucide-react';

import DocumentRelationshipMap from './DocumentRelationshipMap';

const GovifyDocumentsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showNovaPanel, setShowNovaPanel] = useState(false);
  const [hoverDocument, setHoverDocument] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  
  // Add these new state variables
  const [showRelationshipMap, setShowRelationshipMap] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  
  
  // Sample documents data with added Nova summaries and relationships
  const documents = [
    {
      id: 1,
      title: "FY25 Budget Proposal",
      type: "financial",
      department: "Finance",
      dateCreated: "2025-02-15",
      lastModified: "2025-03-28",
      owner: "Sarah Chen",
      status: "In Review",
      tags: ["budget", "fiscal year", "planning"],
      starred: true,
      novaSummary: "This budget allocates $3.2M to Parks & Recreation (up 12% YoY), while reducing Public Safety by 5%. Key initiatives include downtown revitalization and affordable housing programs.",
      relationships: [
        { id: 4, type: "referenced", title: "Parks Maintenance Contract" },
        { id: 2, type: "supports", title: "Downtown Revitalization Plan" },
        { id: 9, type: "supports", title: "Housing Affordability Analysis" }
      ],
      comments: 12,
      versions: 8,
      public: true
    },
    {
      id: 2,
      title: "Downtown Revitalization Plan",
      type: "planning",
      department: "Urban Development",
      dateCreated: "2025-01-10",
      lastModified: "2025-03-22",
      owner: "Michael Rodriguez",
      status: "Approved",
      tags: ["urban planning", "development", "downtown"],
      starred: false,
      novaSummary: "Multi-phase plan focusing on pedestrian-friendly infrastructure, mixed-use zoning, and business incentives. Estimated 5-year completion with $14.5M total investment from city funds and grants.",
      relationships: [
        { id: 1, type: "funded by", title: "FY25 Budget Proposal" },
        { id: 9, type: "relates to", title: "Housing Affordability Analysis" }
      ],
      comments: 23,
      versions: 15,
      public: true
    },
    {
      id: 3,
      title: "Public Safety Committee Minutes",
      type: "minutes",
      department: "Public Safety",
      dateCreated: "2025-03-15",
      lastModified: "2025-03-15",
      owner: "Robert Johnson",
      status: "Final",
      tags: ["committee", "meeting", "public safety"],
      starred: false,
      novaSummary: "Committee voted 4-1 to approve community policing initiative. Discussion focused on budget constraints and staffing issues. Three citizens spoke during public comments about neighborhood safety concerns.",
      relationships: [
        { id: 1, type: "influenced by", title: "FY25 Budget Proposal" },
        { id: 8, type: "precedes", title: "City Council Meeting Agenda" }
      ],
      comments: 5,
      versions: 2,
      public: true
    },
    {
      id: 4,
      title: "Parks Maintenance Contract",
      type: "contract",
      department: "Parks & Recreation",
      dateCreated: "2025-02-28",
      lastModified: "2025-03-10",
      owner: "Emily Williams",
      status: "Signed",
      tags: ["contract", "maintenance", "parks"],
      starred: true,
      novaSummary: "3-year, $1.2M contract with GreenSpace Services Inc. for maintenance of all city parks. Includes quarterly assessments, sustainability requirements, and local hiring provisions.",
      relationships: [
        { id: 1, type: "funded by", title: "FY25 Budget Proposal" }
      ],
      comments: 9,
      versions: 6,
      public: false
    },
    {
      id: 5,
      title: "Community Engagement Strategy",
      type: "policy",
      department: "Community Relations",
      dateCreated: "2025-03-01",
      lastModified: "2025-03-25",
      owner: "Jessica Martinez",
      status: "Draft",
      tags: ["community", "engagement", "outreach"],
      starred: false,
      novaSummary: "Comprehensive framework for increasing civic participation through digital platforms, in-person events, and multilingual outreach. Emphasizes inclusion of traditionally underrepresented groups.",
      relationships: [
        { id: 6, type: "relates to", title: "COVID-19 Relief Program Update" },
        { id: 9, type: "supports", title: "Housing Affordability Analysis" }
      ],
      comments: 18,
      versions: 4,
      public: false
    },
    {
      id: 6,
      title: "COVID-19 Relief Program Update",
      type: "report",
      department: "Health & Human Services",
      dateCreated: "2025-03-18",
      lastModified: "2025-03-18",
      owner: "David Thompson",
      status: "Final",
      tags: ["covid", "relief", "public health"],
      starred: false,
      novaSummary: "Final update on emergency assistance program. 2,450 households received direct aid totaling $3.7M. Program officially ends April 30, 2025 with remaining funds ($285K) redirected to ongoing mental health services.",
      relationships: [
        { id: 5, type: "referenced by", title: "Community Engagement Strategy" },
        { id: 8, type: "agenda item", title: "City Council Meeting Agenda" }
      ],
      comments: 7,
      versions: 3,
      public: true
    },
    {
      id: 7,
      title: "Infrastructure Assessment Q1 2025",
      type: "report",
      department: "Public Works",
      dateCreated: "2025-04-01",
      lastModified: "2025-04-05",
      owner: "James Wilson",
      status: "Draft",
      tags: ["infrastructure", "assessment", "quarterly"],
      starred: false,
      novaSummary: "Roads and bridges rated 'Fair' (C grade). Water system rated 'Good' (B grade). 3 critical repairs identified for immediate action. Estimated $875K in unplanned maintenance needed before Q3.",
      relationships: [
        { id: 1, type: "influences", title: "FY25 Budget Proposal" }
      ],
      comments: 4,
      versions: 2,
      public: false
    },
    {
      id: 8,
      title: "City Council Meeting Agenda",
      type: "agenda",
      department: "City Clerk",
      dateCreated: "2025-03-25",
      lastModified: "2025-03-27",
      owner: "Patricia Brown",
      status: "Published",
      tags: ["council", "meeting", "agenda"],
      starred: true,
      novaSummary: "April 5 meeting includes votes on Downtown Revitalization Plan, COVID-19 relief fund reallocation, and two public hearings on zoning changes. Executive session scheduled for personnel matters.",
      relationships: [
        { id: 2, type: "includes", title: "Downtown Revitalization Plan" },
        { id: 6, type: "includes", title: "COVID-19 Relief Program Update" },
        { id: 3, type: "follows", title: "Public Safety Committee Minutes" }
      ],
      comments: 3,
      versions: 4,
      public: true
    },
    {
      id: 9,
      title: "Housing Affordability Analysis",
      type: "report",
      department: "Housing Authority",
      dateCreated: "2025-02-20",
      lastModified: "2025-03-15",
      owner: "Katherine Lee",
      status: "In Review",
      tags: ["housing", "affordability", "analysis"],
      starred: false,
      novaSummary: "Housing costs increased 8.2% while median income rose only 3.1%. Current deficit of 1,200 affordable units. Recommends density bonuses, inclusionary zoning, and expanding rental assistance program.",
      relationships: [
        { id: 1, type: "influences", title: "FY25 Budget Proposal" },
        { id: 2, type: "relates to", title: "Downtown Revitalization Plan" },
        { id: 5, type: "supported by", title: "Community Engagement Strategy" }
      ],
      comments: 15,
      versions: 7,
      public: false
    }
  ];

  
  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => {
    if (activeCategory !== 'all' && doc.type !== activeCategory) {
      return false;
    }
    
    if (searchQuery === '') {
      return true;
    }
    
    return (
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });
  
  // Document categories/types
  const categories = [
    { id: 'all', label: 'All Documents', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'financial', label: 'Financial', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'policy', label: 'Policies', icon: <Book className="w-4 h-4" /> },
    { id: 'contract', label: 'Contracts', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'report', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'minutes', label: 'Minutes', icon: <Clock className="w-4 h-4" /> },
    { id: 'planning', label: 'Planning', icon: <Calendar className="w-4 h-4" /> }
  ];
  
  // Handle mouse enter for document hover summary
  const handleMouseEnter = (e, doc) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.x + window.scrollX,
      y: rect.y + window.scrollY + rect.height
    });
    setHoverDocument(doc);
  };
  
  // Handle mouse leave for document hover summary
  const handleMouseLeave = () => {
    setHoverDocument(null);
  };


// Add a function to handle document selection and show the relationship map
  const handleDocumentSelect = (docId) => {
    setSelectedDocumentId(docId);
    setShowRelationshipMap(true);
  };

  return (
    // Changed background to light blue similar to apps page
    <div className="flex-1 flex flex-col bg-blue-50 p-6 min-h-screen">
      {/* Header section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold text-indigo-900">Civic Document Center</h1>
          <div className="flex items-center space-x-3">
            <button 
              className="px-4 py-2 text-sm bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center shadow-sm border border-slate-100"
              onClick={() => setShowNovaPanel(!showNovaPanel)}
            >
              <Brain className="w-4 h-4 mr-1.5" /> Ask Nova
            </button>
            <button 
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Upload Document
            </button>
          </div>
        </div>
        
        {/* Search and filter */}
        <div className="w-full bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Search input */}
            <div className="w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents, policies, or ask a question (e.g., 'Show all budget reports from 2024')"
                  className="w-full px-4 py-2.5 pl-10 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-500">
                  <Zap className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Category tabs */}
            <div className="flex justify-center w-full overflow-x-auto">
              <div className="inline-flex bg-slate-50 rounded-lg shadow-sm border border-slate-100 p-1">
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
            
            {/* View mode and additional filters */}
            <div className="flex justify-between w-full">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-50 rounded-lg shadow-sm border border-slate-100 p-1 flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                <button className="p-2 text-slate-600 bg-slate-50 rounded-lg shadow-sm border border-slate-100 flex items-center text-sm">
                  <Filter className="w-3.5 h-3.5 mr-1.5" /> Filters
                </button>
                
                <button className="p-2 text-slate-600 bg-slate-50 rounded-lg shadow-sm border border-slate-100 flex items-center text-sm">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" /> Date
                </button>
                
                <button className="p-2 text-slate-600 bg-slate-50 rounded-lg shadow-sm border border-slate-100 flex items-center text-sm">
                  <Users className="w-3.5 h-3.5 mr-1.5" /> Department
                </button>
              </div>
              
              <div className="text-xs text-slate-500 flex items-center">
                {filteredDocuments.length} documents
              </div>
            </div>
          </div>
        </div>
        
        {/* Nova AI panel - conditionally rendered */}
        {showNovaPanel && (
          <div className="fixed right-5 top-20 w-80 bg-white rounded-xl shadow-lg border border-indigo-100 z-10 overflow-hidden">
            <div className="p-3 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                <span className="font-medium">Nova Assistant</span>
              </div>
              <button onClick={() => setShowNovaPanel(false)} className="text-white/80 hover:text-white">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-500 mb-3">Ask Nova about documents, policies, or civic data:</p>
              <div className="flex mb-4">
                <input 
                  type="text" 
                  placeholder="Ask anything about city documents..."
                  className="flex-1 border border-slate-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button className="bg-indigo-600 text-white rounded-r-lg px-3">
                  <Zap className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs text-slate-500">Try: "Summarize our latest housing policy" or "Show documents related to the budget that mention parks"</div>
            </div>
          </div>
        )}
        
        {/* Hover document summary */}
        {hoverDocument && (
          <div 
            className="fixed bg-white rounded-xl shadow-lg border border-indigo-200 z-20 overflow-hidden w-72"
            style={{
              top: `${hoverPosition.y}px`,
              left: `${hoverPosition.x}px`,
            }}
          >
            <div className="p-3 bg-indigo-50 border-b border-indigo-100">
              <div className="flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-medium text-indigo-700">Nova AI Summary</span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm text-slate-600 mb-3">{hoverDocument.novaSummary}</p>
              
              {/* Document relationships */}
              {hoverDocument.relationships && hoverDocument.relationships.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center space-x-1 mb-1.5">
                    <Link2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-medium text-indigo-600">Related Documents</span>
                  </div>
                  <ul className="text-xs space-y-1">
                    {hoverDocument.relationships.map((rel, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-slate-500 mr-1">{rel.type}:</span>
                        <span className="text-indigo-600 font-medium">{rel.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Document activity stats */}
              <div className="flex justify-between text-xs text-slate-500">
                <div className="flex items-center">
                  <History className="w-3.5 h-3.5 mr-1" />
                  {hoverDocument.versions} versions
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-3.5 h-3.5 mr-1" />
                  {hoverDocument.comments} comments
                </div>
                <div className="flex items-center">
                  {hoverDocument.public ? 
                    <Globe className="w-3.5 h-3.5 mr-1 text-green-500" /> : 
                    <Lock className="w-3.5 h-3.5 mr-1 text-amber-500" />}
                  {hoverDocument.public ? "Public" : "Internal"}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Featured bundles */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-indigo-900 mb-3">Document Bundles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "FY25 Budget Package", icon: <BarChart2 className="w-5 h-5" />, color: "bg-blue-100 text-blue-600", count: 8 },
              { title: "Housing Initiative", icon: <Book className="w-5 h-5" />, color: "bg-emerald-100 text-emerald-600", count: 12 },
              { title: "Council Meeting Apr 5", icon: <Users className="w-5 h-5" />, color: "bg-purple-100 text-purple-600", count: 5 }
            ].map((bundle, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-slate-100 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bundle.color} mr-3`}>
                      {bundle.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{bundle.title}</h3>
                      <div className="text-xs text-slate-500">{bundle.count} documents</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Documents list/grid */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-indigo-900">Recent Documents</h2>
            <button className="text-sm text-indigo-600 flex items-center">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sort by: Last Modified
            </button>
          </div>
          
          {viewMode === 'grid' ? (
            // Grid view
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(doc => (
                <div 
                  key={doc.id} 
                  className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(e, doc)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getDocumentColor(doc.type)} mr-3`}>
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-slate-900 line-clamp-1">{doc.title}</h3>
                          <button className="text-slate-400 hover:text-amber-500">
                            <Star className={`w-4 h-4 ${doc.starred ? 'text-amber-500 fill-amber-500' : ''}`} />
                          </button>
                        </div>
                        <div className="text-xs text-slate-500">{doc.department}</div>
                      </div>
                    </div>
                    
                    {/* Activity indicators */}
                    <div className="flex items-center mb-2 text-xs text-slate-500">
                      <div className="flex items-center mr-3">
                        <History className="w-3 h-3 mr-1" />
                        {doc.versions}
                      </div>
                      <div className="flex items-center mr-3">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {doc.comments}
                      </div>
                      {doc.public ? 
                        <div className="flex items-center text-green-500">
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </div> : 
                        <div className="flex items-center text-amber-500">
                          <Lock className="w-3 h-3 mr-1" />
                          Internal
                        </div>
                      }
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {doc.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <div className="text-slate-500">
                        Last modified: {formatDate(doc.lastModified)}
                      </div>
                      <div className={`${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex justify-between">
                    <div className="flex space-x-2">
                      <button className="p-1 text-slate-400 hover:text-indigo-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-indigo-600">
                        <GitBranch className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-indigo-600">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="p-1 text-slate-400 hover:text-indigo-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List view
            <div className="bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Document</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Owner</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Modified</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocuments.map(doc => (
                    <tr 
                      key={doc.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onMouseEnter={(e) => handleMouseEnter(e, doc)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getDocumentColor(doc.type)} mr-3`}>
                            {getDocumentIcon(doc.type)}
                          </div>
                          <div className="font-medium text-slate-900">{doc.title}</div>
                          {doc.starred && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 ml-2" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{doc.department}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600">{doc.owner}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">{formatDate(doc.lastModified)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="p-1 text-slate-400 hover:text-indigo-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-indigo-600">
                            <GitBranch className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-indigo-600">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-indigo-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom info bar */}
      <div className="mt-6 p-3 bg-white rounded-lg shadow-md flex items-center justify-between">
        <div className="flex items-center text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5 mr-1.5" />
          <span>Documents are secured with enterprise-grade encryption</span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center text-xs text-indigo-600">
            <HelpCircle className="w-3.5 h-3.5 mr-1" /> Help
          </button>
          <button className="flex items-center text-xs text-indigo-600">
            <Shield className="w-3.5 h-3.5 mr-1" /> Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getDocumentIcon = (type) => {
  switch (type) {
    case 'financial':
      return <BarChart2 className="w-4 h-4" />;
    case 'policy':
      return <Book className="w-4 h-4" />;
    case 'contract':
      return <FileCheck className="w-4 h-4" />;
    case 'minutes':
      return <Clock className="w-4 h-4" />;
    case 'planning':
      return <Calendar className="w-4 h-4" />;
    case 'agenda':
      return <FileText className="w-4 h-4" />;
    case 'report':
      return <FileText className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getDocumentColor = (type) => {
  switch (type) {
    case 'financial':
      return 'bg-green-100 text-green-600';
    case 'policy':
      return 'bg-blue-100 text-blue-600';
    case 'contract':
      return 'bg-purple-100 text-purple-600';
    case 'minutes':
      return 'bg-amber-100 text-amber-600';
    case 'planning':
      return 'bg-indigo-100 text-indigo-600';
    case 'agenda':
      return 'bg-red-100 text-red-600';
    case 'report':
      return 'bg-emerald-100 text-emerald-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Draft':
      return 'text-amber-600';
    case 'In Review':
      return 'text-blue-600';
    case 'Approved':
    case 'Signed':
    case 'Final': 
    case 'Published':
      return 'text-emerald-600';
    default:
      return 'text-slate-600';
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'Draft':
      return 'bg-amber-100 text-amber-700';
    case 'In Review':
      return 'bg-blue-100 text-blue-700';
    case 'Approved':
    case 'Signed':
    case 'Final':
    case 'Published':
      return 'bg-emerald-100 text-emerald-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export default GovifyDocumentsPage;