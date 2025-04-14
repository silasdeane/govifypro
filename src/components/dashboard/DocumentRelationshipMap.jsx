import { useState, useEffect } from 'react';
import { 
  ArrowRight, FileText, BarChart2, Book, FileCheck, 
  Clock, Calendar, Link2, Brain, X
} from 'lucide-react';

const DocumentRelationshipMap = ({ documentId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState(null);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  
  // Simulate loading document and relationships
  useEffect(() => {
    const fetchData = async () => {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the main document
      const doc = sampleDocuments.find(d => d.id === documentId);
      setDocument(doc);
      
      // Find all related documents
      if (doc) {
        const related = [];
        // Direct relationships
        doc.relationships.forEach(rel => {
          const relatedDoc = sampleDocuments.find(d => d.id === rel.id);
          if (relatedDoc) {
            related.push({
              ...relatedDoc,
              relationshipType: rel.type,
              direction: 'outgoing'
            });
          }
        });
        
        // Reverse relationships (documents that reference this one)
        sampleDocuments.forEach(d => {
          if (d.id !== doc.id) {
            d.relationships.forEach(rel => {
              if (rel.id === doc.id && !related.some(r => r.id === d.id)) {
                related.push({
                  ...d,
                  relationshipType: rel.type,
                  direction: 'incoming'
                });
              }
            });
          }
        });
        
        setRelatedDocuments(related);
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, [documentId]);
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center">
              <Link2 className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-slate-900">Document Relationships</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-8 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Link2 className="w-8 h-8 text-indigo-300" />
              </div>
              <div className="h-4 bg-slate-200 rounded w-48 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center">
              <Link2 className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold text-slate-900">Document Relationships</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-8 text-center">
            <p className="text-slate-500">Document not found</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center">
            <Link2 className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-lg font-semibold text-slate-900">Document Relationships</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
          {/* Nova insights */}
          <div className="mb-6 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <div className="flex items-start">
              <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-indigo-700 mb-1">Nova Insights</h3>
                <p className="text-sm text-indigo-900 mb-2">
                  This document has connections to {relatedDocuments.length} other documents across {countDepartments(relatedDocuments)} departments.
                </p>
                <p className="text-sm text-indigo-800">
                  <strong>Key finding:</strong> The FY25 Budget Proposal influences multiple planning documents and contracts, forming a critical funding backbone for Q1-Q2 2025 initiatives.
                </p>
              </div>
            </div>
          </div>
          
          {/* Central document */}
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 rounded-xl p-5 w-72 border border-slate-200 shadow-sm">
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getDocumentColor(document.type)} mr-3`}>
                  {getDocumentIcon(document.type)}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{document.title}</h3>
                  <div className="text-xs text-slate-500">{document.department}</div>
                </div>
              </div>
              <div className="text-xs text-slate-600 mb-3">
                {document.novaSummary}
              </div>
              <div className="flex justify-between text-xs">
                <div className="text-slate-500">
                  Last modified: {formatDate(document.lastModified)}
                </div>
                <div className={`${getStatusColor(document.status)}`}>
                  {document.status}
                </div>
              </div>
            </div>
          </div>
          
          {/* Connected documents */}
          {relatedDocuments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Connected Documents</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedDocuments.map(doc => (
                  <div key={doc.id} className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getDocumentColor(doc.type)} mr-3`}>
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 text-sm">{doc.title}</h4>
                        <div className="text-xs text-slate-500">{doc.department}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-2 bg-slate-50 rounded-md p-2">
                      {doc.direction === 'outgoing' ? (
                        <div className="flex items-center text-xs font-medium">
                          <span className="text-indigo-700 mr-1">This document</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 mx-1" />
                          <span className="text-indigo-700">{doc.relationshipType}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 mx-1" />
                          <span className="text-indigo-700">{doc.title}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-xs font-medium">
                          <span className="text-indigo-700 mr-1">{doc.title}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 mx-1" />
                          <span className="text-indigo-700">{doc.relationshipType}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 mx-1" />
                          <span className="text-indigo-700">This document</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-slate-600 line-clamp-2 mb-2">
                      {doc.novaSummary}
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <div className="text-slate-500">
                        {formatDate(doc.lastModified)}
                      </div>
                      <div className={`${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Timeline visualization */}
          <div>
            <h3 className="text-sm font-medium text-slate-900 mb-3">Document Timeline</h3>
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <div className="h-40 w-full flex items-center justify-center">
                <div className="relative w-full">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 transform -translate-y-1/2"></div>
                  {/* This would be a more complex visualization in a real implementation */}
                  {[...relatedDocuments, document].sort((a, b) => 
                    new Date(a.lastModified) - new Date(b.lastModified)
                  ).map((doc, index) => {
                    const position = (index / ([...relatedDocuments, document].length - 1)) * 100;
                    return (
                      <div 
                        key={doc.id} 
                        className="absolute transform -translate-x-1/2"
                        style={{ left: `${position}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
                      >
                        <div 
                          className={`w-4 h-4 rounded-full ${doc.id === document.id ? 'bg-indigo-600' : 'bg-slate-300'} 
                          ${doc.id === document.id ? 'ring-4 ring-indigo-100' : ''}`}
                        ></div>
                        <div 
                          className={`absolute text-xs mt-2 transform -translate-x-1/2 whitespace-nowrap
                          ${index % 2 === 0 ? 'top-6' : 'bottom-6'}`}
                          style={{ left: '50%' }}
                        >
                          <div className="font-medium text-slate-700">{formatDate(doc.lastModified)}</div>
                          <div className="text-slate-500">{doc.title.substring(0, 20)}{doc.title.length > 20 ? '...' : ''}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sample data for the component to use
const sampleDocuments = [
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
    versions: 8
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
    versions: 15
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
    versions: 2
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
    versions: 6
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
      { id: 2, type: "relates to", title: "Downtown Revitalization Plan" }
    ],
    comments: 15,
    versions: 7
  }
];

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

// Count unique departments in a list of documents
const countDepartments = (documents) => {
  const departments = new Set();
  documents.forEach(doc => departments.add(doc.department));
  return departments.size;
};

export default DocumentRelationshipMap;