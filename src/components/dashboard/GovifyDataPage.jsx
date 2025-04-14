import { useState } from 'react';
import { 
  BarChart3, PieChart, TrendingUp, Calendar, Download, Filter, 
  Search, ChevronDown, Layers, Database, FileText, 
  RefreshCw, ExternalLink, ArrowRight, Plus, Info,
  ChevronLeft, ChevronRight, MoreHorizontal, MapPin,
  AlertCircle, CheckCircle, ArrowUpRight, ArrowDownRight, HelpCircle
} from 'lucide-react';

export default function GovifyDataPage() {
  const [selectedDataset, setSelectedDataset] = useState('budget');
  const [selectedTimeframe, setSelectedTimeframe] = useState('quarterly');
  const [activeTab, setActiveTab] = useState('overview');
  
  const datasetOptions = [
    { id: 'budget', label: 'Budget & Finance', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'infrastructure', label: 'Infrastructure Projects', icon: <Layers className="w-4 h-4" /> },
    { id: 'community', label: 'Community Engagement', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'permits', label: 'Permits & Licensing', icon: <FileText className="w-4 h-4" /> }
  ];
  
  const timeframeOptions = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'yearly', label: 'Yearly' },
    { id: 'custom', label: 'Custom Range' }
  ];
  
  const tabOptions = [
    { id: 'overview', label: 'Overview' },
    { id: 'trends', label: 'Trends & Analytics' },
    { id: 'reports', label: 'Reports' },
    { id: 'insights', label: 'AI Insights' }
  ];

  // KPI data for cards
  const kpiData = [
    { 
      title: 'Total Budget Allocated', 
      value: '$24.6M', 
      change: '+3.2%', 
      isPositive: true,
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-indigo-100 text-indigo-600'
    },
    { 
      title: 'Budget Utilization', 
      value: '67.4%', 
      change: '-2.1%', 
      isPositive: false,
      icon: <PieChart className="w-6 h-6" />,
      color: 'bg-amber-100 text-amber-600'
    },
    { 
      title: 'Projects On Track', 
      value: '38', 
      change: '+4', 
      isPositive: true,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-emerald-100 text-emerald-600'
    },
    { 
      title: 'Projects At Risk', 
      value: '7', 
      change: '-2', 
      isPositive: true,
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600'
    }
  ];

  // Department budget data for table
  const departmentBudgets = [
    { department: 'Public Works', allocated: '$6.2M', spent: '$3.8M', remaining: '$2.4M', progress: 61 },
    { department: 'Parks & Recreation', allocated: '$4.1M', spent: '$3.2M', remaining: '$0.9M', progress: 78 },
    { department: 'Public Safety', allocated: '$8.5M', spent: '$5.7M', remaining: '$2.8M', progress: 67 },
    { department: 'Community Services', allocated: '$3.1M', spent: '$1.9M', remaining: '$1.2M', progress: 61 },
    { department: 'Administration', allocated: '$2.7M', spent: '$1.5M', remaining: '$1.2M', progress: 56 }
  ];

  // Recent activity data
  const recentActivity = [
    { 
      type: 'report', 
      title: 'Q2 Budget Report Generated', 
      time: '2 hours ago',
      department: 'Finance'
    },
    { 
      type: 'alert', 
      title: 'Parks Department Over Budget Warning', 
      time: 'Yesterday',
      department: 'Parks & Recreation'
    },
    { 
      type: 'update', 
      title: 'Infrastructure Project #127 Updated', 
      time: 'Yesterday',
      department: 'Public Works'
    },
    { 
      type: 'approval', 
      title: 'Q3 Budget Allocation Approved', 
      time: '3 days ago',
      department: 'City Council'
    }
  ];

  // AI insights data
  const aiInsights = [
    {
      title: 'Potential Budget Optimization',
      description: 'Parks Department could save $86,000 by consolidating equipment maintenance contracts.',
      impact: 'High',
      department: 'Parks & Recreation'
    },
    {
      title: 'Seasonal Revenue Trend Detected',
      description: 'Permit applications show a 32% increase during summer months. Consider optimizing staffing accordingly.',
      impact: 'Medium',
      department: 'Community Services'
    },
    {
      title: 'Preventative Maintenance Recommendation',
      description: 'Historical data suggests scheduling road repairs in May would minimize disruption and reduce costs by 18%.',
      impact: 'High',
      department: 'Public Works'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/30 shadow-lg">
      {/* Header and controls */}
      <div className="p-5 border-b border-slate-200/50 bg-white/20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-indigo-900">Data Analytics Center</h1>
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1.5 text-sm bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center shadow-sm border border-slate-100">
              <Download className="w-4 h-4 mr-1.5" /> Export Data
            </button>
            <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" /> New Report
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Dataset selector */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-sm flex items-center border border-slate-100 px-4 py-2 cursor-pointer">
              <Database className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-sm text-slate-800 mr-1">Dataset:</span>
              <span className="text-sm font-medium text-indigo-900 mr-2">
                {datasetOptions.find(opt => opt.id === selectedDataset)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Timeframe selector */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-sm flex items-center border border-slate-100 px-4 py-2 cursor-pointer">
              <Calendar className="w-4 h-4 text-indigo-600 mr-2" />
              <span className="text-sm text-slate-800 mr-1">Timeframe:</span>
              <span className="text-sm font-medium text-indigo-900 mr-2">
                {timeframeOptions.find(opt => opt.id === selectedTimeframe)?.label}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Search input */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search data, reports, or insights..."
                className="w-full px-4 py-2 pl-10 border border-slate-100 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Filter button */}
          <button className="bg-white rounded-lg shadow-sm flex items-center border border-slate-100 px-4 py-2 hover:bg-indigo-50">
            <Filter className="w-4 h-4 text-indigo-600 mr-2" />
            <span className="text-sm text-slate-800">Filters</span>
          </button>

          {/* Refresh button */}
          <button className="bg-white rounded-lg shadow-sm flex items-center border border-slate-100 p-2 hover:bg-indigo-50">
            <RefreshCw className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="bg-white/30 border-b border-slate-200/50 px-5">
        <div className="flex overflow-x-auto hide-scrollbar">
          {tabOptions.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-900' 
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto p-5 bg-white/5">
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-lg ${kpi.color} flex items-center justify-center`}>
                    {kpi.icon}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full flex items-center ${
                    kpi.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {kpi.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {kpi.change}
                  </div>
                </div>
                <h3 className="text-sm font-medium text-slate-500">{kpi.title}</h3>
                <div className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Main dashboard grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Budget allocation visualization */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-medium text-slate-900">Budget Allocation & Utilization</h3>
                <div className="flex items-center space-x-1">
                  <button className="p-1 rounded hover:bg-slate-100">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-1 rounded hover:bg-slate-100">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="h-[300px] flex items-center justify-center relative">
                  {/* Placeholder for actual chart - you'd use a chart library here */}
                  <div className="w-full h-full">
                    {/* Mockup bar chart */}
                    <div className="flex h-full items-end justify-around p-2">
                      {departmentBudgets.map((dept, i) => (
                        <div key={i} className="flex flex-col items-center w-1/6">
                          <div className="relative w-full">
                            {/* Total allocated bar (background) */}
                            <div className="w-full bg-indigo-100 rounded-t-lg" style={{ height: '200px' }}></div>
                            {/* Spent bar (foreground) */}
                            <div 
                              className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg"
                              style={{ height: `${dept.progress * 2}px` }}
                            ></div>
                          </div>
                          <div className="text-xs text-slate-600 mt-2 font-medium text-center w-full truncate">{dept.department}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Chart legend */}
                    <div className="flex items-center justify-center mt-2 space-x-6">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-indigo-500 mr-1.5 rounded"></div>
                        <span className="text-xs text-slate-600">Spent</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-indigo-100 mr-1.5 rounded"></div>
                        <span className="text-xs text-slate-600">Allocated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Department budget table */}
              <div className="border-t border-slate-100">
                <div className="overflow-x-auto max-h-[220px]">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/80">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Department</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Allocated</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Spent</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Remaining</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Utilization</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {departmentBudgets.map((dept, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 cursor-pointer">
                          <td className="px-4 py-2.5 text-sm font-medium text-slate-900">{dept.department}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600">{dept.allocated}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600">{dept.spent}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600">{dept.remaining}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600">
                            <div className="flex items-center">
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden mr-2">
                                <div
                                  className={`h-full rounded-full ${dept.progress > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${dept.progress}%` }}
                                ></div>
                              </div>
                              <span>{dept.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Activity and AI insights */}
            <div className="space-y-6">
              {/* Recent activity feed */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-medium text-slate-900">Recent Activity</h3>
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                    View All <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="p-3 hover:bg-slate-50/50 cursor-pointer">
                      <div className="flex">
                        <div className="mr-3">
                          {activity.type === 'report' && <FileText className="w-5 h-5 text-indigo-600" />}
                          {activity.type === 'alert' && <AlertCircle className="w-5 h-5 text-amber-500" />}
                          {activity.type === 'update' && <RefreshCw className="w-5 h-5 text-blue-500" />}
                          {activity.type === 'approval' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">{activity.title}</div>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-slate-500">{activity.time}</span>
                            <span className="mx-1 text-slate-300">•</span>
                            <span className="text-xs text-slate-600">{activity.department}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nova AI insights */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-indigo-50/80 flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5">
                        <path d="M12 .25A11.75 11.75 0 1 0 23.75 12 11.77 11.77 0 0 0 12 .25zm0 20.5A8.75 8.75 0 1 1 20.75 12 8.76 8.76 0 0 1 12 20.75zM12.75 8a.75.75 0 0 0-1.5 0v4.25H9.5a.75.75 0 0 0 0 1.5h3.25a.75.75 0 0 0 .75-.75V8z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-indigo-900">Nova AI Insights</h3>
                    <p className="text-xs text-indigo-700">AI-generated recommendations based on your data</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="p-3 hover:bg-slate-50/50 cursor-pointer">
                      <div className="flex items-start">
                        <div className={`px-2 py-1 text-xs rounded-md mr-3 ${
                          insight.impact === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {insight.impact} Impact
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{insight.title}</div>
                          <div className="text-xs text-slate-600 mt-1">{insight.description}</div>
                          <div className="text-xs text-slate-500 mt-1.5">{insight.department}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-slate-100 bg-indigo-50/30">
                  <button className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg flex items-center justify-center">
                    <Plus className="w-3 h-3 mr-1.5" /> Request Detailed Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent reports section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-medium text-slate-900">Recent Reports</h3>
              <div className="flex items-center space-x-1">
                <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-900">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { title: 'Q2 Financial Summary', type: 'XLSX', date: 'Generated Jul 15', icon: 'file-excel' },
                { title: 'Infrastructure Projects Status', type: 'PDF', date: 'Generated Jul 12', icon: 'file-pdf' },
                { title: 'Community Engagement Metrics', type: 'PDF', date: 'Generated Jul 10', icon: 'file-pdf' },
                { title: 'Permit Processing Analysis', type: 'PPTX', date: 'Generated Jul 5', icon: 'file-ppt' }
              ].map((report, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-3 hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all">
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      report.type === 'PDF' ? 'bg-red-100 text-red-600' : 
                      report.type === 'XLSX' ? 'bg-emerald-100 text-emerald-600' : 
                      'bg-amber-100 text-amber-600'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900 line-clamp-1">{report.title}</div>
                      <div className="text-xs text-slate-500">{report.type} • {report.date}</div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button className="text-xs text-indigo-600 hover:text-indigo-800">
                      View Report
                    </button>
                    <button className="text-xs text-slate-500 hover:text-slate-700">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with pagination and info */}
      <div className="border-t border-slate-200/50 p-4 bg-white/20 flex justify-between items-center">
        <div className="text-xs text-slate-500 flex items-center">
          <Info className="w-3.5 h-3.5 mr-1" />
          Data last updated: 17 minutes ago
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-xs rounded-md bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center">
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              className={`w-6 h-6 flex items-center justify-center rounded-md text-xs ${
                page === 1 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-1 text-xs rounded-md bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center">
            Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}