// GovifyAppsPage.jsx
import { useState } from 'react';
import AppInfoCard from './EnhancedAppInfoCard';
import { 
  Grid, Search, Plus, Edit, ArrowRight, 
  Users, RefreshCw, Layers, Monitor, HeartHandshake, Briefcase, DollarSign, 
  BarChart2, Settings, Book, Truck, FileText, Shield, Zap
} from 'lucide-react';

export default function GovifyAppsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedSolutionId, setExpandedSolutionId] = useState(null);
  const [editorMode, setEditorMode] = useState(true);
  const [solutions, setSolutions] = useState([
    {
      id: 1,
      name: 'CitizenConnect',
      category: 'citizen',
      developer: 'Govify AI',
      description: 'Comprehensive citizen engagement platform with 311 service requests, real-time updates, and community feedback channels.',
      keyFeatures: [
        'Multi-channel communication',
        'Service request tracking',
        'Community feedback dashboard'
      ],
      implementation: {
        complexity: 'Medium',
        timeToImplement: '6-8 weeks',
        averageCost: '$75,000 - $120,000'
      },
      icon: <HeartHandshake className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      verified: true,
      roi: '35% increase in citizen satisfaction'
    },
    {
      id: 2,
      name: 'InfraWatch Pro',
      category: 'infrastructure',
      developer: 'SmartCity Technologies',
      description: 'Advanced infrastructure monitoring system using IoT sensors and predictive maintenance algorithms.',
      keyFeatures: [
        'Real-time infrastructure health monitoring',
        'Predictive maintenance scheduling',
        'Cost optimization analytics'
      ],
      implementation: {
        complexity: 'High',
        timeToImplement: '12-16 weeks',
        averageCost: '$250,000 - $500,000'
      },
      icon: <Truck className="w-6 h-6" />,
      color: 'bg-emerald-100 text-emerald-600',
      verified: true,
      roi: '42% reduction in emergency repairs'
    },
    {
      id: 3,
      name: 'BudgetMaster',
      category: 'finance',
      developer: 'GovFinance Innovations',
      description: 'Comprehensive financial management and budget tracking solution with advanced forecasting capabilities.',
      keyFeatures: [
        'Real-time budget tracking',
        'Departmental spending analysis',
        'Grant and fund management'
      ],
      implementation: {
        complexity: 'Medium',
        timeToImplement: '8-10 weeks',
        averageCost: '$150,000 - $250,000'
      },
      icon: <Monitor className="w-6 h-6" />,
      color: 'bg-amber-100 text-amber-600',
      verified: true,
      roi: '28% improved budget accuracy'
    },
    {
      id: 4,
      name: 'OperationsHub',
      category: 'operations',
      developer: 'Urban Dynamics',
      description: 'Integrated operations management platform for seamless coordination across city departments.',
      keyFeatures: [
        'Cross-departmental workflow management',
        'Resource allocation optimizer',
        'Performance tracking dashboards'
      ],
      implementation: {
        complexity: 'High',
        timeToImplement: '16-20 weeks',
        averageCost: '$350,000 - $600,000'
      },
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
      verified: true,
      roi: '52% operational efficiency gain'
    },
    {
      id: 5,
      name: '2Vita',
      category: 'citizen',
      developer: 'Govify AI',
      description: 'AI-powered platform connecting returning citizens with essential resources, support services, and opportunities for successful reintegration.',
      keyFeatures: [
        'Personalized resource matching',
        'Job placement support',
        'Housing connection services',
        'Comprehensive support tracking'
      ],
      implementation: {
        complexity: 'Low',
        timeToImplement: '3-4 weeks',
        averageCost: '$200,000 - $350,000'
      },
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-emerald-100 text-emerald-600',
      verified: true,
      roi: '65% improved reentry success rate',
      complianceInfo: 'FedRAMP compliant, HIPAA & 42 CFR Part 2 compliant. Eligible for BJA Second Chance Act funding.',
      demoUrl: 'https://dev.2vita.ai/login'
    },
    {
      id: 6,
      name: 'CitizenDocs',
      category: 'citizen',
      developer: 'DocuGov Solutions',
      description: 'Digital document management and permitting system with online submission and tracking.',
      keyFeatures: [
        'Online permit applications',
        'Digital document repository',
        'Automated routing and approvals'
      ],
      implementation: {
        complexity: 'Medium',
        timeToImplement: '8-10 weeks',
        averageCost: '$100,000 - $180,000'
      },
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600',
      verified: true,
      roi: '45% reduction in processing time'
    }
  ]);
  
  const categories = [
    { id: 'all', label: 'All Solutions', icon: <Grid className="w-4 h-4" /> },
    { id: 'citizen', label: 'Citizen Services', icon: <Users className="w-4 h-4" /> },
    { id: 'operations', label: 'City Operations', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'finance', label: 'Financial Management', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'infrastructure', label: 'Infrastructure', icon: <Layers className="w-4 h-4" /> },
    { id: 'analytics', label: 'Performance Analytics', icon: <BarChart2 className="w-4 h-4" /> }
  ];
  
  // Filter solutions based on active category and search query
  const filteredSolutions = solutions.filter(solution => {
    const matchesCategory = activeCategory === 'all' || solution.category === activeCategory;
    
    const matchesSearch = searchQuery === '' || 
                        solution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        solution.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  const handleSolutionExpand = (solutionId) => {
    if (expandedSolutionId === solutionId) {
      setExpandedSolutionId(null);
    } else {
      setExpandedSolutionId(solutionId);
    }
  };
  
  const handleSolutionSave = (updatedSolution) => {
    setSolutions(prevSolutions => 
      prevSolutions.map(solution => 
        solution.id === updatedSolution.id ? updatedSolution : solution
      )
    );
  };
  
  const handleAddNewSolution = () => {
    const newSolution = {
      id: solutions.length + 1,
      name: 'New Solution',
      category: 'citizen', // Default category
      developer: 'Your Agency',
      description: 'Description of your new solution.',
      keyFeatures: ['Feature 1', 'Feature 2', 'Feature 3'],
      implementation: {
        complexity: 'Medium',
        timeToImplement: '8-10 weeks',
        averageCost: '$100,000 - $200,000'
      },
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      verified: false,
      roi: 'Add ROI metrics here'
    };
    
    setSolutions(prevSolutions => [...prevSolutions, newSolution]);
    setExpandedSolutionId(newSolution.id);
  };
  
  const handleDemoClick = (demoUrl) => {
    // Open the demo URL in a new tab
    window.open(demoUrl, '_blank');
  };
  
  const toggleEditorMode = () => {
    setEditorMode(!editorMode);
  };

  return (
    <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg overflow-hidden">
      {/* Header section */}
      <div className="p-5 border-b border-slate-200/50 bg-white/20">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-semibold text-indigo-900">Municipal Solutions Marketplace</h1>
          <div className="flex items-center space-x-3">
            <button 
              className="px-4 py-2 text-sm bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center shadow-sm border border-slate-100"
              onClick={toggleEditorMode}
            >
              <Edit className="w-4 h-4 mr-1.5" /> {editorMode ? 'Disable Editing' : 'Enable Editing'}
            </button>
            <button 
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center shadow-sm"
              onClick={handleAddNewSolution}
              disabled={!editorMode}
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add New Solution
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
                placeholder="Search solutions by name, feature, or challenge..."
                className="w-full px-4 py-2.5 pl-10 border border-slate-200 rounded-lg text-sm bg-white/90 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          
          {/* Category tabs - Centered */}
          <div className="flex justify-center w-full overflow-x-auto">
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
          {/* Solutions introduction */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl overflow-hidden shadow-md">
            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center">
              <div className="md:w-3/5 mb-5 md:mb-0 md:pr-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3">Transform City Services with Proven Solutions</h2>
                <p className="text-indigo-100 mb-6">Discover pre-vetted, impact-driven technology solutions designed to enhance municipal efficiency, citizen engagement, and operational excellence.</p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-2.5 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 font-medium shadow-sm flex items-center transition-all">
                    Schedule Consultation <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                  <button className="px-6 py-2.5 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 flex items-center shadow-sm border border-indigo-600 transition-all">
                    <Shield className="w-4 h-4 mr-2" /> Solution Evaluation Guide
                  </button>
                </div>
              </div>
              <div className="md:w-2/5">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-white">
                  <div className="flex items-center mb-3">
                    <Zap className="w-5 h-5 mr-2" />
                    <h3 className="font-medium">Impact-Driven Solutions</h3>
                  </div>
                  <div className="font-mono text-xs bg-indigo-900/70 rounded-md p-3 overflow-x-auto mb-3">
                    <div className="text-emerald-400">ROI Analysis: CitizenConnect</div>
                    <div className="text-indigo-300 mt-2">{"{"}</div>
                    <div className="text-indigo-300 ml-4">"efficiency_gain": 35.2%,</div>
                    <div className="text-indigo-300 ml-4">"cost_savings": "$425,000/year",</div>
                    <div className="text-indigo-300 ml-4">"implementation_time": "8 weeks"</div>
                    <div className="text-indigo-300">{"}"}</div>
                  </div>
                  <div className="flex items-center text-xs">
                    <Book className="w-3.5 h-3.5 mr-1.5 text-yellow-300" />
                    <span className="text-indigo-200">{solutions.length} verified solutions | Proven impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Solutions gallery section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-indigo-900">Featured Solutions</h2>
              <div className="text-sm text-indigo-600">
                <span className="mr-2">Editor Mode:</span>
                <span className={`font-semibold ${editorMode ? 'text-green-600 underline' : 'text-slate-500'}`}>
                  {editorMode ? 'On' : 'Off'}
                </span>
              </div>
            </div>
            
            {filteredSolutions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSolutions.map(solution => (
                  <AppInfoCard
                    key={solution.id}
                    solution={solution}
                    expanded={expandedSolutionId === solution.id}
                    onToggleExpand={() => handleSolutionExpand(solution.id)}
                    onSave={handleSolutionSave}
                    onDemo={solution.name === '2Vita' && solution.demoUrl ? 
                      () => handleDemoClick(solution.demoUrl) : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">No solutions found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  We couldn't find any solutions matching your search criteria. Try adjusting your filters or search query.
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
          
          {/* Bottom call to action */}
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium text-indigo-800 mb-1">Ready to transform your municipal operations?</h3>
                <p className="text-indigo-600 text-sm">Schedule a personalized demo with our government solutions team.</p>
              </div>
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm flex items-center justify-center">
                Request Demo <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}